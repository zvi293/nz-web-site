import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Mail,
  MessageCircle,
  User,
  Phone,
  Building2,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { addLead } from "@/lib/leads-api";
import { sendContactEmailNotification } from "@/lib/contact-email-api";
import { getWhatsAppHref, useContactInfo } from "@/lib/contact-utils";
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

const emailFieldSchema = z
  .string()
  .trim()
  .max(100, { message: "כתובת האימייל חייבת להיות עד 100 תווים" })
  .optional()
  .or(z.literal(""));

const contactSchema = z
  .object({
    sendMethod: z.enum(["whatsapp", "email"]),
    name: z
      .string()
      .trim()
      .min(2, { message: "השם חייב להכיל לפחות 2 תווים" })
      .max(50, { message: "השם חייב להיות עד 50 תווים" }),
    email: emailFieldSchema,
    phone: z
      .string()
      .trim()
      .min(9, { message: "מספר טלפון חייב להכיל לפחות 9 ספרות" })
      .max(15, { message: "מספר טלפון חייב להיות עד 15 ספרות" })
      .regex(/^[0-9\-+()\s]+$/, {
        message: "מספר טלפון יכול להכיל רק ספרות ותווים מיוחדים: +()-",
      }),
    companyName: z
      .string()
      .trim()
      .max(100, { message: "שם החברה חייב להיות עד 100 תווים" })
      .optional(),
    inquiryType: z
      .string()
      .trim()
      .max(80, { message: "סוג הפנייה חייב להיות עד 80 תווים" })
      .optional(),
    subject: z
      .string()
      .trim()
      .max(200, { message: "נושא הפנייה חייב להיות עד 200 תווים" }),
  })
  .superRefine((data, ctx) => {
    if (data.sendMethod !== "email") {
      return;
    }

    const email = data.email?.trim() ?? "";
    if (!email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "כתובת אימייל חייבת",
      });
      return;
    }

    if (!z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "כתובת אימייל לא תקינה",
      });
    }
  });

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState<string | null>(
    null,
  );
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">(
    "whatsapp",
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formStartedAt] = useState(() => new Date().toISOString());
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const contact = useContactInfo();

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
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      sendMethod: "whatsapp",
      name: "",
      email: "",
      phone: "",
      companyName: "",
      inquiryType: "",
      subject: "",
    },
  });

  useEffect(() => {
    setValue("sendMethod", sendMethod, {
      shouldDirty: false,
      shouldValidate: true,
    });

    if (sendMethod === "whatsapp") {
      setValue("email", "", {
        shouldDirty: false,
        shouldValidate: false,
      });
      clearErrors("email");
    }
  }, [clearErrors, sendMethod, setValue]);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmissionWarning(null);

    try {
      let submissionNotice: string | null = null;
      const effectiveSendMethod = data.sendMethod;
      const leadEmail =
        effectiveSendMethod === "email"
          ? data.email?.trim() ?? ""
          : undefined;
      const subject = data.subject.trim();

      const lead = await addLead({
        name: data.name,
        email: leadEmail,
        phone: data.phone,
        companyName: data.companyName,
        inquiryType: data.inquiryType,
        subject,
        sendMethod: effectiveSendMethod,
      });

      if (effectiveSendMethod === "whatsapp") {
        const subjectLine = subject ? `\n\nנושא הפנייה: ${subject}` : "";
        const message = `שלום! אני ${data.name}${data.companyName ? ` מחברת ${data.companyName}` : ""}.

טלפון: ${data.phone}${subjectLine}

אשמח לקבל מידע נוסף על השירותים שלכם.`;

        const whatsappUrl = getWhatsAppHref(
          contact,
          data.inquiryType
            ? `${message}\nסוג פנייה: ${data.inquiryType}`
            : message,
        );
        window.open(whatsappUrl, "_blank");
      } else {
        try {
          await sendContactEmailNotification({
            leadId: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            companyName: lead.companyName,
            inquiryType: lead.inquiryType,
            subject: lead.subject || "",
            sendMethod: "email",
            createdAt: lead.createdAt,
            formStartedAt,
            submittedAt: new Date().toISOString(),
            honeypot: honeypotRef.current?.value ?? "",
          });
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "";
          submissionNotice = errorMessage.includes("RATE_LIMITED")
            ? "הפנייה נשמרה במערכת, אך נחסמה שליחת מייל נוספת לזמן קצר כדי למנוע ספאם."
            : "הפנייה נשמרה במערכת, אך שליחת מייל ההתראה נכשלה כרגע.";
          setSubmissionWarning(submissionNotice);
        }
      }

      setIsSubmitted(true);
      reset({
        sendMethod: "whatsapp",
        name: "",
        email: "",
        phone: "",
        companyName: "",
        inquiryType: "",
        subject: "",
      });
      setSendMethod("whatsapp");

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
        title: submissionNotice
          ? "הפנייה נשמרה במערכת"
          : "הפנייה נשלחה בהצלחה!",
        description: submissionNotice ?? "אנחנו ניצור איתך קשר בהקדם האפשרי.",
        variant: submissionNotice ? "destructive" : "default",
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה בשליחת הפנייה",
        description: "אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                {submissionWarning ?? "אנחנו ניצור איתך קשר בהקדם האפשרי."}
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
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Label className="mb-3 block text-sm font-medium">
                  בחר אופן קבלת הפנייה:
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={sendMethod === "whatsapp" ? "default" : "outline"}
                    onClick={() => setSendMethod("whatsapp")}
                    className={`flex-1 gap-2 ${
                      sendMethod === "whatsapp"
                        ? "border-[#25D366] bg-[#25D366] text-white hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                        : "border-[#BFEFD1] bg-[#DDF8E8] text-[#1E7A46] hover:border-[#2ECC71] hover:bg-[#2ECC71] hover:text-white"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    וואטסאפ
                  </Button>
                  <Button
                    type="button"
                    variant={sendMethod === "email" ? "default" : "outline"}
                    onClick={() => setSendMethod("email")}
                    className={`flex-1 gap-2 ${
                      sendMethod === "email"
                        ? "border-[#5DADE2] bg-[#5DADE2] text-white hover:border-[#5DADE2] hover:bg-[#5DADE2] hover:text-white"
                        : "border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    אימייל
                  </Button>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                  ref={honeypotRef}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  defaultValue=""
                />
                <input
                  type="hidden"
                  name="formStartedAt"
                  value={formStartedAt}
                  readOnly
                />
                <input type="hidden" {...register("sendMethod")} />

                <motion.div
                  className={`grid grid-cols-1 gap-6 ${sendMethod === "email" ? "md:grid-cols-2" : ""}`}
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

                  {sendMethod === "email" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        אימייל <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="your@email.com"
                          className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.email ? "border-destructive" : ""}`}
                        />
                        <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      שם החברה / עסק
                    </Label>
                    <div className="relative">
                      <Input
                        id="companyName"
                        {...register("companyName")}
                        placeholder="שם החברה או העסק (אופציונלי)"
                        className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.companyName ? "border-destructive" : ""}`}
                      />
                      <Building2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    </div>
                    {errors.companyName && (
                      <p className="text-sm text-destructive">
                        {errors.companyName.message}
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
                      to="/terms"
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      תנאי השימוש
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
                    disabled={!isValid || isSubmitting || !acceptedTerms}
                  >
                    {sendMethod === "whatsapp" ? (
                      <MessageCircle className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {isSubmitting
                      ? "שולח..."
                      : `שלח פנייה ${sendMethod === "whatsapp" ? "בוואטסאפ" : "באימייל"}`}
                  </Button>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {sendMethod === "whatsapp"
                      ? "לחיצה על כפתור השליחה תפתח את אפליקציית הוואטסאפ עם הפרטים שמילאת"
                      : "לחיצה על כפתור השליחה תשמור את הפנייה במערכת ותשלח מייל אל צוות האתר"}
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
