interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-300">
        {title}
      </h1>
      {description && <p className="text-slate-500 mt-1">{description}</p>}
    </div>
  )
}
