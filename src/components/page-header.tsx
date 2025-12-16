import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  DialogComponent: () => ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  DialogComponent,
  children,
}: PageHeaderProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <DialogComponent />
      </div>
      {children}
    </div>
  );
}
