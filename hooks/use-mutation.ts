import { useState, useCallback } from "react";

interface UseMutationOptions<TInput, TOutput> {
  mutationFn: (input: TInput) => Promise<TOutput>;
  onSuccess?: (data: TOutput) => void;
  onError?: (error: Error) => void;
}

export function useMutation<TInput, TOutput>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationOptions<TInput, TOutput>) {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (input: TInput) => {
      setIsPending(true);
      try {
        const result = await mutationFn(input);
        onSuccess?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Something went wrong");
        onError?.(error);
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const mutateAsync = useCallback(
    async (input: TInput) => {
      setIsPending(true);
      try {
        const result = await mutationFn(input);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Something went wrong");
        onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return { mutate, mutateAsync, isPending };
}
