import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, User, Briefcase } from "lucide-react";
import { fetchSiteSettings } from "@/lib/site-settings-api";
import { getMailtoHref, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";

const Accessibility = () => {
  const siteSettings = fetchSiteSettings();
  const { accessibility, contact } = siteSettings;
  const lastUpdated = accessibility.lastUpdated;

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <Header />
      <BackToHome />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl md:text-5xl font-black text-foreground mb-8"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              ׳”׳¦׳”׳¨׳× ׳ ׳’׳™׳©׳•׳× ג€“ NZ-web
            </h1>

            <div className="prose prose-lg max-w-none text-foreground space-y-8" style={{ fontFamily: "'Heebo', sans-serif" }}>

              {/* ׳׳‘׳•׳ */}
              <div className="bg-primary/5 rounded-3xl p-6 md:p-8 border border-primary/10">
                <h2 className="text-xl font-bold text-foreground mb-3">׳׳‘׳•׳</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ׳׳ ׳• ׳‘-<span className="text-primary font-bold">NZ-web</span> ׳¨׳•׳׳™׳ ׳—׳©׳™׳‘׳•׳× ׳¢׳׳™׳•׳ ׳” ׳‘׳”׳ ׳’׳©׳× ׳”׳©׳™׳¨׳•׳×׳™׳ ׳”׳“׳™׳’׳™׳˜׳׳™׳™׳ ׳©׳׳ ׳• ׳׳›׳׳ ׳”׳׳•׳›׳׳•׳¡׳™׳™׳”, 
                  ׳•׳‘׳›׳׳ ׳–׳” ׳׳׳ ׳©׳™׳ ׳¢׳ ׳׳•׳’׳‘׳׳•׳™׳•׳×. ׳׳×׳¨ ׳ ׳’׳™׳© ׳”׳•׳ ׳׳ ׳¨׳§ ׳“׳¨׳™׳©׳” ׳—׳•׳§׳™׳×, ׳׳׳ ׳‘׳™׳˜׳•׳™ ׳׳¢׳¨׳›׳™׳ ׳©׳׳ ׳• ׳•׳׳¨׳¦׳•׳ ׳׳׳₪׳©׳¨ ׳׳›׳ ׳׳“׳ 
                  ׳—׳•׳•׳™׳™׳× ׳’׳׳™׳©׳” ׳¢׳¦׳׳׳™׳×, ׳׳›׳•׳‘׳“׳× ׳•׳©׳•׳•׳™׳•׳ ׳™׳×.
                </p>
              </div>

              {/* ׳¡׳˜׳ ׳“׳¨׳˜ ׳”׳ ׳’׳™׳©׳•׳× */}
              <Section title="׳¡׳˜׳ ׳“׳¨׳˜ ׳”׳ ׳’׳™׳©׳•׳×">
                <p className="text-muted-foreground leading-relaxed">
                  ׳׳×׳¨ ׳–׳” ׳¢׳•׳׳“ ׳‘׳“׳¨׳™׳©׳•׳× ׳×׳§׳ ׳•׳× ׳©׳•׳•׳™׳•׳ ׳–׳›׳•׳™׳•׳× ׳׳׳ ׳©׳™׳ ׳¢׳ ׳׳•׳’׳‘׳׳•׳× (׳”׳×׳׳׳•׳× ׳ ׳’׳™׳©׳•׳× ׳׳©׳™׳¨׳•׳×), ׳”׳×׳©׳¢"׳’-2013. 
                  ׳”׳×׳׳׳•׳× ׳”׳ ׳’׳™׳©׳•׳× ׳‘׳•׳¦׳¢׳• ׳‘׳”׳×׳׳ ׳׳”׳׳׳¦׳•׳× ׳”׳×׳§׳ ׳”׳™׳©׳¨׳׳׳™ (׳×"׳™ 5568) ׳‘׳¨׳׳× <strong className="text-primary">AA</strong> ׳•׳¢׳ ׳₪׳™ ׳”׳ ׳—׳™׳•׳× ׳׳¡׳׳ 
                  <strong className="text-primary"> WCAG 2.1</strong> ׳”׳‘׳™׳ ׳׳׳•׳׳™.
                </p>
              </Section>

              {/* ׳”׳×׳׳׳•׳× ׳”׳ ׳’׳™׳©׳•׳× ׳©׳‘׳•׳¦׳¢׳• */}
              <Section title="׳”׳×׳׳׳•׳× ׳”׳ ׳’׳™׳©׳•׳× ׳©׳‘׳•׳¦׳¢׳•">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ׳‘׳׳×׳¨ ׳”׳•׳˜׳׳¢ ׳×׳₪׳¨׳™׳˜ ׳ ׳’׳™׳©׳•׳× ׳׳×׳§׳“׳ ׳”׳›׳•׳׳ ׳׳× ׳”׳׳₪׳©׳¨׳•׳™׳•׳× ׳”׳‘׳׳•׳×:
                </p>
                <div className="grid gap-4">
                  <FeatureCard 
                    title="׳ ׳™׳•׳•׳˜ ׳׳§׳׳“׳×"
                    description="׳×׳׳™׳›׳” ׳׳׳׳” ׳‘׳©׳™׳׳•׳© ׳‘׳׳§׳©׳™ ׳”-Tab ׳•׳”-Enter ׳׳׳¢׳‘׳¨ ׳‘׳™׳ ׳¨׳›׳™׳‘׳™׳."
                  />
                  <FeatureCard 
                    title="׳”׳×׳׳׳•׳× ׳×׳¦׳•׳’׳”"
                    description="׳©׳™׳ ׳•׳™ ׳ ׳™׳’׳•׳“׳™׳•׳× (׳§׳•׳ ׳˜׳¨׳¡׳˜ ׳’׳‘׳•׳”), ׳”׳₪׳™׳›׳” ׳׳’׳•׳•׳ ׳™ ׳׳₪׳•׳¨, ׳•׳”׳’׳“׳׳× ׳¡׳׳ ׳”׳¢׳›׳‘׳¨."
                  />
                  <FeatureCard 
                    title="׳˜׳§׳¡׳˜ ׳•׳§׳¨׳™׳׳•׳×"
                    description="׳”׳’׳“׳׳× ׳’׳•׳₪׳ ׳™׳, ׳׳¢׳‘׳¨ ׳׳’׳•׳₪׳ ׳§׳¨׳™׳ ׳•׳”׳“׳’׳©׳× ׳§׳™׳©׳•׳¨׳™׳ ׳•׳›׳•׳×׳¨׳•׳× ׳‘׳¦׳•׳¨׳” ׳‘׳•׳׳˜׳×."
                  />
                  <FeatureCard 
                    title="׳¢׳–׳¨׳™׳ ׳•׳™׳–׳•׳׳׳™׳™׳"
                    description="׳׳“׳¨׳™׳ ׳§׳¨׳™׳׳” ׳׳׳¨׳›׳•׳– ׳”׳₪׳•׳§׳•׳¡ ׳•׳¢׳¦׳™׳¨׳× ׳׳ ׳™׳׳¦׳™׳•׳× ׳•׳¨׳›׳™׳‘׳™׳ ׳ ׳¢׳™׳."
                  />
                  <FeatureCard 
                    title="׳×׳׳™׳׳•׳× ׳˜׳›׳ ׳•׳׳•׳’׳™׳×"
                    description="׳”׳׳×׳¨ ׳׳•׳×׳׳ ׳׳¦׳₪׳™׳™׳” ׳‘׳“׳₪׳“׳₪׳ ׳™׳ ׳׳•׳“׳¨׳ ׳™׳™׳ ׳•׳׳©׳™׳׳•׳© ׳‘׳×׳•׳›׳ ׳•׳× ׳§׳•׳¨׳ ׳׳¡׳ (׳‘׳׳׳¦׳¢׳•׳× ׳×׳’׳™׳•׳× ARIA ׳¡׳׳ ׳˜׳™׳•׳×)."
                  />
                </div>
              </Section>

              {/* ׳¡׳™׳™׳’׳™׳ ׳׳ ׳’׳™׳©׳•׳× */}
              <Section title="׳¡׳™׳™׳’׳™׳ ׳׳ ׳’׳™׳©׳•׳×">
                <p className="text-muted-foreground leading-relaxed">
                  ׳׳ ׳• ׳׳©׳§׳™׳¢׳™׳ ׳׳׳׳¦׳™׳ ׳¨׳‘׳™׳ ׳‘׳×׳—׳–׳•׳§׳× ׳ ׳’׳™׳©׳•׳× ׳”׳׳×׳¨. ׳¢׳ ׳–׳׳×, ׳™׳™׳×׳›׳ ׳©׳™׳×׳’׳׳• ׳“׳₪׳™׳ ׳׳• ׳—׳׳§׳™׳ ׳©׳˜׳¨׳ ׳”׳•׳ ׳’׳©׳• ׳‘׳׳׳•׳׳ 
                  ׳¢׳§׳‘ ׳׳’׳‘׳׳•׳× ׳˜׳›׳ ׳•׳׳•׳’׳™׳•׳× ׳׳• ׳©׳™׳ ׳•׳™׳™ ׳×׳•׳›׳ ׳”. ׳‘׳׳™׳“׳” ׳•׳׳¦׳׳×׳ ׳×׳§׳׳”, ׳ ׳©׳׳— ׳׳ ׳×׳¢׳“׳›׳ ׳• ׳׳•׳×׳ ׳• ׳›׳“׳™ ׳©׳ ׳•׳›׳ ׳׳×׳§׳ ׳” ׳‘׳”׳§׳“׳.
                </p>
              </Section>

              {/* ׳×׳׳™׳׳•׳× ׳¡׳‘׳™׳‘׳•׳× ׳”׳₪׳¢׳׳” */}
              <Section title="׳×׳׳™׳׳•׳× ׳¡׳‘׳™׳‘׳•׳× ׳”׳₪׳¢׳׳”">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  ׳”׳׳×׳¨ ׳ ׳‘׳“׳§ ׳•׳ ׳׳¦׳ ׳×׳•׳׳ ׳׳¡׳‘׳™׳‘׳•׳× ׳”׳”׳₪׳¢׳׳” ׳”׳‘׳׳•׳×:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">׳“׳₪׳“׳₪׳ ׳™׳:</strong> Google Chrome, Mozilla Firefox, Safari, Microsoft Edge (׳”׳’׳¨׳¡׳׳•׳× ׳”׳¢׳“׳›׳ ׳™׳•׳×)</li>
                  <li><strong className="text-foreground">׳׳¢׳¨׳›׳•׳× ׳”׳₪׳¢׳׳”:</strong> Windows, macOS, Android, iOS</li>
                  <li><strong className="text-foreground">׳§׳•׳¨׳׳™ ׳׳¡׳:</strong> NVDA, JAWS, VoiceOver, TalkBack</li>
                  <li><strong className="text-foreground">׳ ׳™׳•׳•׳˜:</strong> ׳×׳׳™׳›׳” ׳׳׳׳” ׳‘׳ ׳™׳•׳•׳˜ ׳׳§׳׳“׳×</li>
                </ul>
              </Section>

              {/* ׳™׳¦׳™׳¨׳× ׳§׳©׳¨ ׳¢׳ ׳¨׳›׳– ׳”׳ ׳’׳™׳©׳•׳× */}
              <Section title="׳™׳¦׳™׳¨׳× ׳§׳©׳¨ ׳¢׳ ׳¨׳›׳– ׳”׳ ׳’׳™׳©׳•׳×">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ׳׳›׳ ׳©׳׳׳”, ׳×׳§׳׳” ׳׳• ׳”׳¦׳¢׳” ׳׳©׳™׳₪׳•׳¨ ׳”׳ ׳’׳™׳©׳•׳×, ׳ ׳™׳×׳ ׳׳₪׳ ׳•׳× ׳׳׳™׳ ׳•:
                </p>
                <div className="bg-secondary/40 rounded-2xl p-6 border border-border/50">
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">׳¨׳›׳– ׳”׳ ׳’׳™׳©׳•׳×:</strong> {accessibility.coordinatorName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">׳˜׳׳₪׳•׳:</strong> <a href={getTelHref(accessibility.coordinatorPhone)} className="text-primary hover:underline">{accessibility.coordinatorPhone}</a></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">׳׳™׳׳™׳™׳:</strong> <a href={getMailtoHref(accessibility.coordinatorEmail)} className="text-primary hover:underline">{accessibility.coordinatorEmail}</a></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">׳•׳•׳׳˜׳¡׳׳₪:</strong> <a href={getWhatsAppHref(contact)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">׳©׳׳— ׳”׳•׳“׳¢׳”</a></p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* ׳“׳™׳•׳•׳— ׳¢׳ ׳×׳§׳׳•׳× ׳ ׳’׳™׳©׳•׳× */}
              <Section title="׳“׳™׳•׳•׳— ׳¢׳ ׳×׳§׳׳•׳× ׳ ׳’׳™׳©׳•׳×">
                <p className="text-muted-foreground leading-relaxed">
                  ׳׳ ׳ ׳×׳§׳׳× ׳‘׳‘׳¢׳™׳™׳× ׳ ׳’׳™׳©׳•׳× ׳‘׳׳×׳¨, ׳ ׳©׳׳— ׳׳©׳׳•׳¢ ׳׳׳ ׳•׳׳˜׳₪׳ ׳‘׳›׳ ׳‘׳”׳§׳“׳. 
                  ׳‘׳¢׳× ׳”׳₪׳ ׳™׳™׳”, ׳׳ ׳ ׳¦׳™׳™׳ ׳׳× ׳”׳₪׳¨׳˜׳™׳ ׳”׳‘׳׳™׳:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-3">
                  <li>׳›׳×׳•׳‘׳× ׳”׳“׳£ (URL) ׳‘׳• ׳ ׳×׳§׳׳× ׳‘׳‘׳¢׳™׳”</li>
                  <li>׳×׳™׳׳•׳¨ ׳”׳‘׳¢׳™׳”</li>
                  <li>׳¡׳•׳’ ׳”׳“׳₪׳“׳₪׳ ׳•׳׳¢׳¨׳›׳× ׳”׳”׳₪׳¢׳׳”</li>
                  <li>׳˜׳›׳ ׳•׳׳•׳’׳™׳” ׳׳¡׳™׳™׳¢׳× ׳‘׳©׳™׳׳•׳© (׳׳ ׳¨׳׳•׳•׳ ׳˜׳™)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  ׳ ׳™׳×׳ ׳׳₪׳ ׳•׳× ׳׳׳™׳ ׳• ׳‘׳׳׳¦׳¢׳•׳× ׳₪׳¨׳˜׳™ ׳¨׳›׳– ׳”׳ ׳’׳™׳©׳•׳× ׳”׳׳₪׳•׳¨׳˜׳™׳ ׳׳¢׳™׳, 
                  ׳׳• ׳“׳¨׳ <Link to="/contact" className="text-primary hover:underline font-bold">׳˜׳•׳₪׳¡ ׳™׳¦׳™׳¨׳× ׳”׳§׳©׳¨</Link> ׳‘׳׳×׳¨.
                </p>
              </Section>

              {/* ׳×׳§׳ ׳•׳× ׳¨׳׳•׳•׳ ׳˜׳™׳•׳× */}
              <Section title="׳×׳§׳ ׳•׳× ׳¨׳׳•׳•׳ ׳˜׳™׳•׳×">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  ׳”׳¦׳”׳¨׳× ׳ ׳’׳™׳©׳•׳× ׳–׳• ׳ ׳›׳×׳‘׳” ׳‘׳”׳×׳׳ ׳׳×׳§׳ ׳•׳× ׳”׳‘׳׳•׳×:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>׳×׳§׳ ׳•׳× ׳©׳•׳•׳™׳•׳ ׳–׳›׳•׳™׳•׳× ׳׳׳ ׳©׳™׳ ׳¢׳ ׳׳•׳’׳‘׳׳•׳× (׳”׳×׳׳׳•׳× ׳ ׳’׳™׳©׳•׳× ׳׳©׳™׳¨׳•׳×), ׳×׳©׳¢"׳’-2013</li>
                  <li>׳¡׳¢׳™׳£ 34 ג€“ ׳₪׳¨׳¡׳•׳ ׳”׳×׳׳׳•׳× ׳”׳ ׳’׳™׳©׳•׳× ׳©׳‘׳•׳¦׳¢׳• ׳‘׳׳¨׳’׳•׳</li>
                  <li>׳¡׳¢׳™׳£ 35 ג€“ ׳”׳×׳׳׳•׳× ׳ ׳’׳™׳©׳•׳× ׳‘׳©׳™׳¨׳•׳×׳™ ׳”׳׳™׳ ׳˜׳¨׳ ׳˜</li>
                  <li>׳×׳§׳ ׳” 91 ג€“ ׳¨׳›׳– ׳”׳ ׳’׳™׳©׳•׳×</li>
                  <li>׳×׳§׳ ׳™׳©׳¨׳׳׳™ 5568 ג€“ ׳”׳ ׳’׳©׳× ׳×׳›׳ ׳™׳ ׳‘׳׳™׳ ׳˜׳¨׳ ׳˜</li>
                  <li>WCAG 2.1 ׳‘׳¨׳׳” AA</li>
                </ul>
              </Section>

              {/* ׳×׳׳¨׳™׳ ׳¢׳“׳›׳•׳ ׳׳—׳¨׳•׳ */}
              <div className="pt-6 border-t border-border text-sm text-muted-foreground">
                <p>׳×׳׳¨׳™׳ ׳¢׳“׳›׳•׳ ׳׳—׳¨׳•׳: <strong className="text-foreground">{lastUpdated}</strong></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-bold text-foreground mb-3">{title}</h2>
    {children}
  </div>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
    <h3 className="font-bold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Accessibility;
