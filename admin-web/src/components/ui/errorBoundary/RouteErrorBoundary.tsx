import { Button, Result } from "antd";
import { Link, useRouteError } from "react-router";

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred while rendering this page.";
}

export default function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <Result
      status="error"
      title="This page couldn't be displayed"
      subTitle={describeError(error)}
      extra={
        <Link to="/admin">
          <Button type="primary">Back to dashboard</Button>
        </Link>
      }
    />
  );
}
