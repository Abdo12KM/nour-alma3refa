"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import {
  BookOpenIcon,
  BookTextIcon,
  BrainCircuitIcon,
  GraduationCapIcon,
  Users2Icon,
  ArrowRightIcon,
  StarIcon,
  HeartIcon,
  AwardIcon,
  Lightbulb,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { AudioButton } from "@/components/ui/audio-button";
import { Marquee } from "@/components/magicui/marquee";
import { VideoButton } from "@/components/ui/video-button";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 },
  },
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, userId, username } = useAuthStore();

  // Debug output for auth state
  console.log("Home page - Auth state:", { isAuthenticated, userId, username });

  // Testimonial data for the marquee
  const testimonials = [
    { icon: StarIcon, text: "تعلمت القراءة في أسبوعين فقط" },
    { icon: HeartIcon, text: "طريقة ممتازة للتعلم بسهولة وسرعة" },
    { icon: AwardIcon, text: "الصوت يساعدني كثيرًا في فهم الحروف" },
    { icon: StarIcon, text: "التطبيق سهل الاستخدام ومناسب لجميع الأعمار" },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/learn");
    } else {
      router.push("/login");
    }
  };

  return (
    <MainLayout>
      {/* Auth Debug - only in development */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white text-xs rounded z-50 opacity-60 hover:opacity-100">
          <div>Auth: {isAuthenticated ? "✅" : "❌"}</div>
          <div>User: {username || "N/A"}</div>
          <div>ID: {userId || "N/A"}</div>
        </div>
      )} */}

      {/* Hero Section with animation */}
      <motion.section
        className="py-20 text-center relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="flex gap-3 p-1 justify-center items-center text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            نور المعرفة
            <Lightbulb className="w-14 h-14 text-blue-500" />
          </motion.h1>

          <motion.p
            className="text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            رحلتك نحو القراءة والكتابة تبدأ هنا
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative flex flex-col items-center gap-4"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
            <AudioButton
              size="lg"
              className="relative text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onAction={handleGetStarted}
              audioSrc="/audio/start-learning.wav"
              immediateAction={true}
            >
              ابدأ التعلم
              <ArrowRightIcon className="mr-2 h-5 w-5" />
            </AudioButton>

            <VideoButton 
              className="relative text-base" 
              audioSrc="/audio/how-to-learn-intro.wav"
            />
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </motion.section>

      {/* Testimonials Marquee */}
      <div className="bg-muted/30 py-4 overflow-hidden border-y border-primary/5">
        <Marquee className="py-2" pauseOnHover={true}>
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="flex items-center mx-8 px-5 py-3 bg-gradient-to-r from-card to-card/90 shadow-sm rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 mr-3">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Features with staggered animation */}
      <section className="py-16 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            مميزات التطبيق
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="bg-gradient-to-b from-card to-card/80 p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-32 h-32 bg-primary blur-3xl"></div>
              </div>

              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/30 group-hover:from-primary/20 group-hover:to-primary/40 transition-all duration-300 shadow-md">
                <BookOpenIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                تعلم الأبجدية العربية
              </h3>
              <p className="text-muted-foreground">
                تعلم الحروف العربية من الألف إلى الياء بطريقة تفاعلية ومبسطة
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-b from-card to-card/80 p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-32 h-32 bg-primary blur-3xl"></div>
              </div>

              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/30 group-hover:from-primary/20 group-hover:to-primary/40 transition-all duration-300 shadow-md">
                <BookTextIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تعلم الأرقام</h3>
              <p className="text-muted-foreground">
                تعلم الأرقام والعد بطريقة سهلة ومدعومة بالصوت والصور
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-b from-card to-card/80 p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-32 h-32 bg-primary blur-3xl"></div>
              </div>

              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/30 group-hover:from-primary/20 group-hover:to-primary/40 transition-all duration-300 shadow-md">
                <BrainCircuitIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ذكاء اصطناعي</h3>
              <p className="text-muted-foreground">
                تقنيات الذكاء الاصطناعي لتحسين التعلم وتخصيص التجربة
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 left-1/2 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent blur-2xl transform -translate-x-1/2"></div>
        </div>
      </section>

      {/* How it works with interactive steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            كيف يعمل التطبيق؟
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="text-center"
              variants={stepVariants}
              whileHover="hover"
            >
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold hover:bg-primary/20 transition-colors">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">سجل حساب</h3>
              <p className="text-muted-foreground">
                أنشئ حساب بالصوت أو الكتابة بكل سهولة
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={stepVariants}
              whileHover="hover"
            >
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold hover:bg-primary/20 transition-colors">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">اختر الدروس</h3>
              <p className="text-muted-foreground">
                حدد ما تريد تعلمه من حروف وأرقام وكلمات
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={stepVariants}
              whileHover="hover"
            >
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold hover:bg-primary/20 transition-colors">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">ابدأ التعلم</h3>
              <p className="text-muted-foreground">
                تمتع بتجربة تعليمية تفاعلية مدعومة بالصوت
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target audience with animated sections */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-8"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            لمن هذا التطبيق؟
          </motion.h2>

          <motion.p
            className="text-xl text-center text-muted-foreground mb-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            تطبيق نور المعرفة مصمم للأشخاص الذين يرغبون في تعلم القراءة والكتابة
            باللغة العربية
          </motion.p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                className="flex items-start p-4 hover:bg-card rounded-lg transition-colors"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="ml-4 shrink-0">
                  <Users2Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    البالغين الأميين
                  </h3>
                  <p className="text-muted-foreground">
                    الذين يرغبون في اكتساب مهارات القراءة والكتابة لتحسين فرصهم
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start p-4 hover:bg-card rounded-lg transition-colors"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="ml-4 shrink-0">
                  <GraduationCapIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    المتعلمين المبتدئين
                  </h3>
                  <p className="text-muted-foreground">
                    الذين يحتاجون إلى تعلم أساسيات اللغة العربية بطريقة مبسطة
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="rounded-lg bg-card p-6 shadow-md border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <blockquote className="text-lg">
                <p className="mb-4">
                  يهدف تطبيق نور المعرفة إلى معالجة تحدي الأمية في مصر من خلال
                  تقديم تجربة تعليمية مبتكرة تعتمد على الصوت واللعب للبالغين
                  الأميين وشبه الأميين.
                </p>
                <p className="font-semibold">
                  باستخدام تقنيات الذكاء الاصطناعي والتفاعل الصوتي، نجعل الخطوات
                  الأولى نحو محو الأمية سهلة ومشجعة قدر الإمكان.
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to action with animation */}
      <motion.section
        className="py-16 relative overflow-hidden"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ابدأ رحلتك التعليمية الآن
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            انضم إلى الآلاف من المتعلمين وابدأ رحلتك نحو القراءة والكتابة
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AudioButton
              size="lg"
              className="text-lg px-8 shadow-md hover:shadow-lg transition-all duration-300"
              onAction={() => router.push("/register")}
              audioSrc="/audio/go-to-register.wav"
            >
              تسجيل حساب جديد
            </AudioButton>

            <AudioButton
              variant="outline"
              size="lg"
              className="text-lg px-8 hover:bg-primary/5 transition-all duration-300"
              onAction={() => router.push("/login")}
              audioSrc="/audio/go-to-login.wav"
            >
              تسجيل الدخول
            </AudioButton>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
        </div>
      </motion.section>

      <motion.footer
        className="py-8 bg-muted/30 border-t text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} نور المعرفة - جميع الحقوق محفوظة</p>
        </div>
      </motion.footer>
    </MainLayout>
  );
}
