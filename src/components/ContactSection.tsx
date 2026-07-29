import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  MessageCircle,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getWhatsAppHref, contactInfo } from "@/lib/contact-utils";
import { getPlanLabel } from "@/data/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const inquiryTypeOptions = [
  "בניית אתר",
  "אתר תדמית לעסק",
  "אתר מכירות / חנות אונליין",
  "שדרוג אתר קיים",
  "דף נחיתה",
  "מערכת ניהול תורים",
  "קידום / שיווק",
  "משהו אחר",
] as const;

/**
 * The site has no backend: submitting opens WhatsApp with the details the
 * visitor filled in, pre-composed. Nothing is stored or sent server-side.
 */
const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "השם חייב להכיל לפחות 2 תווים" })
      .max(50, { message: "השם חייב להיות עד 50 תווים" }),
    phone: z
      .string()
      .trim()
      .min(9, { message: "מספר טלפון חייב להכיל לפחות 9 ספרות" })
      .max(15, { message: "מספר טלפון חייב להיות עד 15 ספרות" })
      .regex(/^[0-9\-+()\s]+$/, {
        message: "מספר טלפון יכול להכיל רק ספרות ותווים מיוחדים: +()-",
      }),
    inquiryType: z
      .string()
      .trim()
      .max(80, { message: "סוג הפנייה חייב להיות עד 80 תווים" })
      .optional(),
    subject: z
      .string()
      .trim()
      .max(200, { message: "נושא הפנייה חייב להיות עד 200 תווים" }),
  });

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawFog = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const blobs = [
        { x: 0.2, y: 0.3, r: 400, speed: 1, phase: 0 },
        { x: 0.7, y: 0.5, r: 450, speed: 0.7, phase: 1.5 },
        { x: 0.5, y: 0.7, r: 380, speed: 1.2, phase: 3 },
        { x: 0.8, y: 0.2, r: 420, speed: 0.5, phase: 4.5 },
        { x: 0.3, y: 0.8, r: 400, speed: 0.9, phase: 2.5 },
        { x: 0.5, y: 0.2, r: 350, speed: 0.6, phase: 5 },
      ];

      for (const blob of blobs) {
        const cx =
          canvas.width * blob.x +
          Math.sin(time * blob.speed + blob.phase) * 120;
        const cy =
          canvas.height * blob.y +
          Math.cos(time * blob.speed * 0.8 + blob.phase) * 90;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.r);
        gradient.addColorStop(0, "hsla(210, 70%, 70%, 0.35)");
        gradient.addColorStop(0.4, "hsla(210, 60%, 75%, 0.18)");
        gradient.addColorStop(0.7, "hsla(200, 50%, 80%, 0.08)");
        gradient.addColorStop(1, "hsla(210, 40%, 85%, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(drawFog);
    };

    drawFog();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      name: "",
      phone: "",
      inquiryType: "",
      subject: "",
    },
  });

  const scrollToTarget = (element: HTMLElement) => {
    const headerOffset = window.innerWidth >= 768 ? 104 : 72;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLButtonElement
      ) {
        element.focus({ preventScroll: true });
      }
    });
  };

  const scrollToFirstError = (errorKeys: string[]) => {
    const fieldOrder = ["name", "phone", "inquiryType", "subject"];

    const firstField = fieldOrder.find((field) => errorKeys.includes(field));
    if (firstField) {
      const element = document.getElementById(firstField);
      if (element instanceof HTMLElement) {
        scrollToTarget(element);
        return;
      }
    }

    if (errorKeys.includes("terms") && termsRef.current) {
      scrollToTarget(termsRef.current);
    }
  };

  /* Pre-fill the form when arriving from a pricing CTA (e.g. /contact/?plan=premium). */
  useEffect(() => {
    const planLabel = getPlanLabel(searchParams.get("plan"));
    if (!planLabel) return;
    setValue("inquiryType", "אתר תדמית לעסק", { shouldDirty: false, shouldValidate: true });
    setValue(
      "subject",
      `אני מעוניין/ת בחבילת ${planLabel} לאתר תדמית. אשמח לפרטים ולהצעה.`,
      { shouldDirty: true, shouldValidate: true },
    );
  }, [searchParams, setValue]);

  const onSubmit = (data: ContactForm) => {
    try {
      const subject = data.subject.trim();
      const subjectLine = subject ? `\n\nנושא הפנייה: ${subject}` : "";
      const message = `שלום! אני ${data.name}.

טלפון: ${data.phone}${subjectLine}

אשמח לקבל מידע נוסף על השירותים שלכם.`;

      const whatsappUrl = getWhatsAppHref(
        contactInfo,
        data.inquiryType
          ? `${message}\nסוג פנייה: ${data.inquiryType}`
          : message,
      );
      window.open(whatsappUrl, "_blank");

      setIsSubmitted(true);
      reset({
        name: "",
        phone: "",
        inquiryType: "",
        subject: "",
      });
      // Navigate to thank-you page after short delay (let confetti play)
      setTimeout(() => { navigate("/thank-you/"); }, 1800);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 300);

      toast({
        title: "הפנייה נשלחה בהצלחה!",
        description: "אנחנו ניצור איתך קשר בהקדם האפשרי.",
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה בפתיחת וואטסאפ",
        description: "אנא נסו שוב, או צרו קשר ישירות בטלפון.",
        variant: "destructive",
      });
    }
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    scrollToFirstError(Object.keys(errors));
  };

  const handleFormSubmitCapture = (event: React.FormEvent<HTMLFormElement>) => {
    if (acceptedTerms || !termsRef.current) {
      return;
    }

    event.preventDefault();
    scrollToTarget(termsRef.current);
  };

  if (isSubmitted) {
    return (
      <section
        id="contact"
        aria-label="צור קשר"
        className="py-16 px-4"
        dir="rtl"
      >
        <div className="container mx-auto max-w-4xl">
          <Card className="border-emerald-200 bg-emerald-50 shadow-lg">
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
              <h3 className="mb-2 text-2xl font-bold text-emerald-800">
                הפנייה נשלחה בהצלחה!
              </h3>
              <p className="text-emerald-700">
                אנחנו ניצור איתך קשר בהקדם האפשרי.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      aria-label="צור קשר"
      className="relative overflow-hidden bg-secondary/20 px-4 py-16"
      dir="rtl"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
            צור קשר
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            מעוניין בשירותים שלנו? השאר פרטים ואנחנו ניצור איתך קשר
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Card className="border-border/50 bg-card/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                פרטי יצירת קשר
              </CardTitle>
              <CardDescription className="text-center">
                מלא את הטופס ואנחנו ניצור איתך קשר
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmitCapture={handleFormSubmitCapture}
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="space-y-6"
              >
                <motion.div
                  className="grid grid-cols-1 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <User className="h-4 w-4 text-primary" />
                      שם מלא <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="השם המלא שלך"
                        className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.name ? "border-destructive" : ""}`}
                      />
                      <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                </motion.div>

                <motion.div
                  className="grid grid-cols-1 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      טלפון <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="050-1234567"
                        className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.phone ? "border-destructive" : ""}`}
                      />
                      <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    </div>
                  {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <Label
                    htmlFor="inquiryType"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    אני מעוניין ב־
                  </Label>
                  <div className="relative">
                    <select
                      id="inquiryType"
                      {...register("inquiryType")}
                      defaultValue=""
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:shadow-md focus:shadow-primary/10"
                    >
                      <option value="">בחרו אם רלוונטי</option>
                      {inquiryTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <FileText className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  </div>
                  {errors.inquiryType && (
                    <p className="text-sm text-destructive">
                      {errors.inquiryType.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Label
                    htmlFor="subject"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    נושא הפנייה
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="subject"
                      {...register("subject")}
                      placeholder="תאר בקצרה את הפרויקט או השירות שאתה מעוניין בו..."
                      rows={4}
                      className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.subject ? "border-destructive" : ""}`}
                    />
                    <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/50" />
                  </div>
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  ref={termsRef}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                >
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) =>
                      setAcceptedTerms(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="cursor-pointer leading-relaxed text-muted-foreground text-sm"
                  >
                    קראתי ואני מאשר/ת את{" "}
                    <Link
                      to="/terms/"
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      תנאי השימוש
                    </Link>{" "}
                    /{" "}
                    <Link
                      to="/privacy/"
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      מדיניות ופרטיות
                    </Link>
                  </Label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={!isValid || !acceptedTerms}
                  >
                    <MessageCircle className="h-4 w-4" />
                    שלח פנייה בוואטסאפ
                  </Button>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    לחיצה על כפתור השליחה תפתח את אפליקציית הוואטסאפ עם הפרטים שמילאת
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
