import { ArrowRight } from "lucide-react";

const BackToHome = () => (
  <div className="mx-auto max-w-7xl px-6 pt-4" dir="rtl">
    <a
      href="/"
      className="inline-flex items-center gap-2 font-heebo text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <ArrowRight className="h-4 w-4" />
      חזרה לדף הראשי
    </a>
  </div>
);

export default BackToHome;
