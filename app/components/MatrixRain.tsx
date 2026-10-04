"use client";

import { useEffect, useRef } from "react";

const CUDA_LINES = [
  "__global__ void matmul_kernel(float* A, float* B, float* C, int M, int N, int K) {",
  "  int row = blockIdx.y * blockDim.y + threadIdx.y;",
  "  int col = blockIdx.x * blockDim.x + threadIdx.x;",
  "  float sum = 0.0f;",
  "  for (int k = 0; k < K; ++k) {",
  "    sum += A[row * K + k] * B[k * N + col];",
  "  }",
  "  C[row * N + col] = sum;",
  "}",
  "__shared__ float tile_A[BLOCK_SIZE][BLOCK_SIZE];",
  "__shared__ float tile_B[BLOCK_SIZE][BLOCK_SIZE];",
  "tile_A[ty][tx] = A[row * K + t * BLOCK_SIZE + tx];",
  "tile_B[ty][tx] = B[(t * BLOCK_SIZE + ty) * N + col];",
  "__syncthreads();",
  "dim3 grid(N / BLOCK_SIZE, M / BLOCK_SIZE);",
  "dim3 block(BLOCK_SIZE, BLOCK_SIZE);",
  "matmul_kernel<<<grid, block>>>(d_A, d_B, d_C, M, N, K);",
  "cudaMalloc((void**)&d_A, bytes);",
  "cudaMalloc((void**)&d_B, bytes);",
  "cudaMalloc((void**)&d_C, bytes);",
  "cudaMemcpy(d_A, h_A, bytes, cudaMemcpyHostToDevice);",
  "cudaMemcpy(d_B, h_B, bytes, cudaMemcpyHostToDevice);",
  "cudaMemcpy(h_C, d_C, bytes, cudaMemcpyDeviceToHost);",
  "cudaFree(d_A); cudaFree(d_B); cudaFree(d_C);",
  "__global__ void attention_kernel(float* Q, float* K, float* V, float* out, int seq_len, int d_model) {",
  "  int idx = blockIdx.x * blockDim.x + threadIdx.x;",
  "  float score = 0.0f;",
  "  for (int j = 0; j < d_model; ++j) {",
  "    score += Q[idx * d_model + j] * K[idx * d_model + j];",
  "  }",
  "  score /= sqrtf((float)d_model);",
  "  out[idx] = expf(score);",
  "#include <cuda_runtime.h>",
  "#include <cublas_v2.h>",
  "#include <cuda_fp16.h>",
  "#include <mma.h>",
  "using namespace nvcuda::wmma;",
  "__device__ float warp_reduce_sum(float val) {",
  "  for (int offset = 16; offset > 0; offset /= 2)",
  "    val += __shfl_down_sync(0xffffffff, val, offset);",
  "  return val;",
  "}",
  "template<int BLOCK_M, int BLOCK_N, int BLOCK_K>",
  "__global__ void flash_attn_fwd(const half* __restrict__ Q, const half* __restrict__ K,",
  "  const half* __restrict__ V, half* __restrict__ O, float* __restrict__ L,",
  "  const int N, const int d, const float scale) {",
  "  int tid = threadIdx.x;",
  "  int batch_id = blockIdx.z;",
  "  int head_id = blockIdx.y;",
  "  int warp_id = tid / 32;",
  "  int lane_id = tid % 32;",
  "  wmma::fragment<wmma::matrix_a, 16, 16, 16, half, wmma::row_major> a_frag;",
  "  wmma::fragment<wmma::matrix_b, 16, 16, 16, half, wmma::col_major> b_frag;",
  "  wmma::fragment<wmma::accumulator, 16, 16, 16, float> c_frag;",
  "  wmma::load_matrix_sync(a_frag, sQ + wi * 16, d);",
  "  wmma::load_matrix_sync(b_frag, sK + wj * 16, d);",
  "  wmma::mma_sync(c_frag, a_frag, b_frag, c_frag);",
  "cudaStream_t stream;",
  "cudaStreamCreate(&stream);",
  "kernel<<<grid, block, shared_mem, stream>>>(d_Q, d_K, d_V, d_O, N, d);",
  "cudaStreamSynchronize(stream);",
  "cudaStreamDestroy(stream);",
  "cublasHandle_t handle;",
  "cublasCreate(&handle);",
  "cublasSetMathMode(handle, CUBLAS_TENSOR_OP_MATH);",
  "cublasSgemm(handle, CUBLAS_OP_N, CUBLAS_OP_T, N, M, K, &alpha, d_B, N, d_A, M, &beta, d_C, N);",
  "cublasGemmEx(handle, CUBLAS_OP_N, CUBLAS_OP_T, N, M, K, &alpha, d_B, CUDA_R_16F, N,",
  "  d_A, CUDA_R_16F, M, &beta, d_C, CUDA_R_16F, N, CUDA_R_32F, CUBLAS_GEMM_DEFAULT_TENSOR_OP);",
  "__global__ void softmax_kernel(float* input, float* output, int n) {",
  "  extern __shared__ float sdata[];",
  "  int tid = threadIdx.x;",
  "  float max_val = -INFINITY;",
  "  for (int i = tid; i < n; i += blockDim.x)",
  "    max_val = fmaxf(max_val, input[i]);",
  "  sdata[tid] = max_val;",
  "  __syncthreads();",
  "  for (int s = blockDim.x / 2; s > 0; s >>= 1) {",
  "    if (tid < s) sdata[tid] = fmaxf(sdata[tid], sdata[tid + s]);",
  "    __syncthreads();",
  "  }",
  "  float sum = 0.0f;",
  "  for (int i = tid; i < n; i += blockDim.x)",
  "    sum += expf(input[i] - sdata[0]);",
  "  output[tid] = expf(input[tid] - sdata[0]) / sum;",
  "}",
  "cudaGetDeviceCount(&device_count);",
  "cudaDeviceProp prop;",
  "cudaGetDeviceProperties(&prop, 0);",
  "printf(\"GPU: %s  SMs: %d  Mem: %zu MB\\n\", prop.name, prop.multiProcessorCount, prop.totalGlobalMem >> 20);",
  "__global__ void layernorm_kernel(float* out, const float* inp, const float* gamma,",
  "  const float* beta, int N, int C) {",
  "  int idx = blockIdx.x;",
  "  float mean = 0.0f;",
  "  for (int i = threadIdx.x; i < C; i += blockDim.x)",
  "    mean += inp[idx * C + i];",
  "  mean = warp_reduce_sum(mean) / C;",
  "  float var = 0.0f;",
  "  for (int i = threadIdx.x; i < C; i += blockDim.x) {",
  "    float diff = inp[idx * C + i] - mean;",
  "    var += diff * diff;",
  "  }",
  "  var = warp_reduce_sum(var) / C;",
  "  float inv_std = rsqrtf(var + 1e-5f);",
  "  out[idx * C + threadIdx.x] = gamma[threadIdx.x] * (inp[idx * C + threadIdx.x] - mean) * inv_std + beta[threadIdx.x];",
  "}",
  "__global__ void gelu_kernel(float* out, const float* inp, int N) {",
  "  int i = blockIdx.x * blockDim.x + threadIdx.x;",
  "  if (i < N) {",
  "    float x = inp[i];",
  "    out[i] = 0.5f * x * (1.0f + tanhf(0.7978845608f * (x + 0.044715f * x * x * x)));",
  "  }",
  "}",
  "cudaEvent_t start, stop;",
  "cudaEventCreate(&start); cudaEventCreate(&stop);",
  "cudaEventRecord(start, stream);",
  "transformer_fwd<<<grid, block, 0, stream>>>(d_out, d_inp, d_wq, d_wk, d_wv, d_wo, N, d, H);",
  "cudaEventRecord(stop, stream);",
  "cudaEventSynchronize(stop);",
  "float ms = 0; cudaEventElapsedTime(&ms, start, stop);",
  "printf(\"Kernel time: %.3f ms  TFLOPS: %.2f\\n\", ms, 2.0 * N * N * d / (ms * 1e9));",
  "int num_sms; cudaDeviceGetAttribute(&num_sms, cudaDevAttrMultiProcessorCount, 0);",
  "cudaOccupancyMaxActiveBlocksPerMultiprocessor(&num_blocks, kernel, block_size, shared_mem);",
  "printf(\"Occupancy: %.1f%%\\n\", 100.0f * num_blocks * block_size / max_threads_per_sm);",
  "nccl_comm_t comm; ncclCommInitRank(&comm, world_size, id, rank);",
  "ncclAllReduce(d_grad, d_grad, count, ncclFloat, ncclSum, comm, stream);",
];

interface Column {
  x: number;
  y: number;
  speed: number;
  lineIdx: number;
  charPos: number;
  trail: { text: string; y: number; age: number }[];
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const FONT_SIZE = 13;
    const LINE_HEIGHT = 18;
    const isMobile = window.innerWidth < 768;
    const NUM_COLUMNS = isMobile ? 15 : 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create columns spread across the screen
    const columns: Column[] = [];
    for (let i = 0; i < NUM_COLUMNS; i++) {
      columns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        speed: 0.8 + Math.random() * 2.2,
        lineIdx: Math.floor(Math.random() * CUDA_LINES.length),
        charPos: 0,
        trail: [],
      });
    }

    const draw = () => {
      // Fade previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "SF Mono", "Fira Code", monospace`;

      for (const col of columns) {
        // Get current CUDA line
        const line = CUDA_LINES[col.lineIdx];

        // Draw the head character (brightest)
        if (col.y > 0 && col.y < canvas.height + 200) {
          const char = line[col.charPos] || " ";

          // Head glow — white/bright green
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00ff41";
          ctx.shadowBlur = 8;
          ctx.fillText(char, col.x, col.y);
          ctx.shadowBlur = 0;

          // Add to trail
          col.trail.push({ text: char, y: col.y, age: 0 });
        }

        // Draw trail
        for (let t = col.trail.length - 1; t >= 0; t--) {
          const tr = col.trail[t];
          tr.age++;

          if (tr.age > 60) {
            col.trail.splice(t, 1);
            continue;
          }

          const alpha = Math.max(0, 1 - tr.age / 60);

          if (tr.age < 3) {
            ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
          } else if (tr.age < 15) {
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.8})`;
          } else {
            ctx.fillStyle = `rgba(0, 180, 45, ${alpha * 0.5})`;
          }

          ctx.fillText(tr.text, col.x, tr.y);
        }

        // Advance character position
        col.charPos++;
        col.y += LINE_HEIGHT * col.speed * 0.35;

        // When we reach end of line, move to next line
        if (col.charPos >= line.length) {
          col.charPos = 0;
          col.lineIdx = (col.lineIdx + 1) % CUDA_LINES.length;
          col.y += LINE_HEIGHT * 2; // gap between lines
        }

        // Reset when off screen
        if (col.y > canvas.height + 300) {
          col.y = Math.random() * -400;
          col.x = Math.random() * canvas.width;
          col.speed = 0.8 + Math.random() * 2.2;
          col.lineIdx = Math.floor(Math.random() * CUDA_LINES.length);
          col.charPos = 0;
          col.trail = [];
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    // Lower opacity on mobile
    canvas.style.opacity = isMobile ? "0.35" : "0.7";

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
