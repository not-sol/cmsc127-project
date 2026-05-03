import type { SectionHeaderField as SectionHeaderFieldConfig } from "@/features/forms/form-types"

type SectionHeaderFieldProps = {
  config: SectionHeaderFieldConfig
}

export function SectionHeaderField({ config }: SectionHeaderFieldProps) {
  return (
    <div className="pt-4 pb-2 border-b border-border">
      <h3 className="text-base font-semibold text-foreground">{config.label}</h3>
      {config.description && (
        <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  )
}
