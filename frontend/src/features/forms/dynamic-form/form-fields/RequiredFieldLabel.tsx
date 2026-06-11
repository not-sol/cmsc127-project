import type { ReactNode } from "react"

type RequiredFieldLabelProps = {
  children: ReactNode
  required: boolean
}

export function RequiredFieldLabel({
  children,
  required,
}: RequiredFieldLabelProps) {
  return (
    <>
      <span>{children}</span>
      {required && (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </>
  )
}
