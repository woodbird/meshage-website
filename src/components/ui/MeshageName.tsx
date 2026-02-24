/**
 * Brand name with "Mesh" in bold for consistent VI (mesh + age, distinct from "message").
 */
export function MeshageName({ className }: { className?: string } = {}) {
  const content = (
    <>
      <strong>Mesh</strong>age
    </>
  );
  if (className) {
    return <span className={className}>{content}</span>;
  }
  return content;
}
