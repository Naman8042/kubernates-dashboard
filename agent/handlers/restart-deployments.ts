import { executeKubectl } from "./safe-kubectl";

interface Input {
  namespace: string;
  deployment: string;
}

export async function restartDeployment({
  namespace,
  deployment,
}: Input) {
  const result = executeKubectl(
    `rollout restart deployment/${deployment} -n ${namespace}`,
  );

  return {
    success: true,
    deployment,
    output: result,
  };
}