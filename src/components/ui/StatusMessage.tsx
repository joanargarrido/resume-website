export function StatusMessage({
  status,
}: {
  status: { ok: boolean; message: string } | null;
}) {
  if (!status) return null;
  return (
    <p
      role={status.ok ? "status" : "alert"}
      className={`text-sm ${status.ok ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      {status.message}
    </p>
  );
}
