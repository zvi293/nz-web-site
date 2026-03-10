import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Send, CheckCircle, Mail, MessageCircle, User, Phone, Building2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { addLead } from "@/lib/leads-api";
import { getContactInfo, getMailtoHref, getWhatsAppHref } from "@/lib/contact-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
// Validation schema
const contactSchema = z.object({
  name: z.string().
  trim().
  min(2, { message: "השם חייב להכיל לפחות 2 תווים" }).
  max(50, { message: "השם חייב להיות עד 50 תווים" }),
  email: z.string().
  trim().
  email({ message: "כתובת אימייל לא תקינה" }).
  max(100, { message: "כתובת האימייל חייבת להיות עד 100 תווים" }),
  phone: z.string().
  trim().
  min(9, { message: "מספר טלפון חייב להכיל לפחות 9 ספרות" }).
  max(15, { message: "מספר טלפון חייב להיות עד 15 ספרות" }).
  regex(/^[0-9\-\+\(\)\s]+$/, { message: "מספר טלפון יכול להכיל רק ספרות ותווים מיוחדים: +()-" }),
  companyName: z.string().
  trim().
  max(100, { message: "שם החברה חייב להיות עד 100 תווים" }).
  optional(),
  subject: z.string().
  trim().
  min(5, { message: "נושא הפניה חייב להכיל לפחות 5 תווים" }).
  max(200, { message: "נושא הפניה חייב להיות עד 200 תווים" })
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contact = getContactInfo();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

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
        const cx = canvas.width * blob.x + Math.sin(time * blob.speed + blob.phase) * 120;
        const cy = canvas.height * blob.y + Math.cos(time * blob.speed * 0.8 + blob.phase) * 90;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.r);
        gradient.addColorStop(0, 'hsla(210, 70%, 70%, 0.35)');
        gradient.addColorStop(0.4, 'hsla(210, 60%, 75%, 0.18)');
        gradient.addColorStop(0.7, 'hsla(200, 50%, 80%, 0.08)');
        gradient.addColorStop(1, 'hsla(210, 40%, 85%, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(drawFog);
    };

    drawFog();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);

    try {
      // Save lead to localStorage
      addLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        subject: data.subject,
        sendMethod,
      });


      if (sendMethod === "whatsapp") {
        // Create WhatsApp message with validated data
        const message = `שלום! אני ${data.name}${data.companyName ? ` מחברת ${data.companyName}` : ''}.
        
📧 אימייל: ${data.email}
📞 טלפון: ${data.phone}
        
נושא הפניה: ${data.subject}
        
אשמח לקבל מידע נוסף על השירותים שלכם.`;

        const whatsappUrl = getWhatsAppHref(contact, message);

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
      } else {
        // Handle Email submission
        const subject = encodeURIComponent(`פניה חדשה מ${data.name}`);
        const body = encodeURIComponent(`שם: ${data.name}
טלפון: ${data.phone}
אימייל: ${data.email}
${data.companyName ? `חברה: ${data.companyName}` : ''}

נושא הפניה:
${data.subject}`);
        const mailtoUrl = `${getMailtoHref(contact.email)}?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
      }

      setIsSubmitted(true);
      reset();

      // Fire confetti 🎉
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
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
        title: "הפניה נשלחה בהצלחה!",
        description: "אנחנו ניצור איתך קשר בהקדם האפשרי."
      });

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "שגיאה בשליחת הפניה",
        description: "אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" aria-label="צור קשר" className="py-16 px-4" dir="rtl">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-emerald-200 bg-emerald-50 shadow-lg">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">הפניה נשלחה בהצלחה!</h3>
              <p className="text-emerald-700">אנחנו ניצור איתך קשר בהקדם האפשרי.</p>
            </CardContent>
          </Card>
        </div>
      </section>);

  }



  return (
    <section id="contact" aria-label="צור קשר" className="relative py-16 px-4 bg-secondary/20 overflow-hidden" dir="rtl">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            צור קשר
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            מעוניין בשירותים שלנו? השאר פרטים ואנחנו ניצור איתך קשר
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle className="text-xl text-center">פרטי יצירת קשר</CardTitle>
            <CardDescription className="text-center">
              מלא את הטופס ואנחנו ניצור איתך קשר
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Send Method Selection */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="text-sm font-medium mb-3 block">בחר אופן קבלת הפניה:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sendMethod === "whatsapp" ? "default" : "outline"}
                  onClick={() => setSendMethod("whatsapp")}
                  className={`flex-1 gap-2 ${sendMethod === "whatsapp" ? "bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white" : ""}`}>
                  <MessageCircle className="h-4 w-4" />
                  וואטסאפ
                </Button>
                <Button
                  type="button"
                  variant={sendMethod === "email" ? "default" : "outline"}
                  onClick={() => setSendMethod("email")}
                  className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  אימייל
                </Button>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    שם מלא <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="השם המלא שלך"
                      className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.name ? "border-destructive" : ""}`} />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  </div>
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    אימייל <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.email ? "border-destructive" : ""}`} />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    טלפון <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="050-1234567"
                      className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.phone ? "border-destructive" : ""}`} />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  </div>
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                {/* Company Name - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    שם החברה / עסק
                  </Label>
                  <div className="relative">
                    <Input
                      id="companyName"
                      {...register("companyName")}
                      placeholder="שם החברה או העסק (אופציונלי)"
                      className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.companyName ? "border-destructive" : ""}`} />
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  </div>
                  {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                </div>
              </motion.div>

              {/* Subject */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  נושא הפניה <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="subject"
                    {...register("subject")}
                    placeholder="תאר בקצרה את הפרויקט או השירות שאתה מעוניין בו..."
                    rows={4}
                    className={`pr-10 transition-shadow duration-300 focus:shadow-md focus:shadow-primary/10 ${errors.subject ? "border-destructive" : ""}`} />
                  <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/50" />
                </div>
                {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
              </motion.div>

              {/* Terms checkbox */}
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
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  קראתי ואני מאשר/ת את{" "}
                  <Link to="/terms" className="text-primary hover:underline font-medium" target="_blank">
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
                  disabled={!isValid || isSubmitting || !acceptedTerms}>
                  {sendMethod === "whatsapp" ?
                  <MessageCircle className="h-4 w-4" /> :
                  <Mail className="h-4 w-4" />
                  }
                  {isSubmitting ? "שולח..." : `שלח פניה ${sendMethod === "whatsapp" ? "בוואטסאפ" : "באימייל"}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {sendMethod === "whatsapp" ?
                  "לחיצה על כפתור השליחה תפתח את אפליקציית הוואטסאפ עם הפרטים שמילאת" :
                  "לחיצה על כפתור השליחה תפתח את תוכנת האימייל שלך עם הפרטים שמילאת"
                  }
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </section>);

};

export default ContactSection;
