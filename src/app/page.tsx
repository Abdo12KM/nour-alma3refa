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
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { AudioButton } from "@/components/ui/audio-button";
import { Marquee } from "@/components/magicui/marquee";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Add floating animation for subtle movement
const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  },
};

const textAnimateRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const textAnimateUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Add reduced motion hook for accessibility
  const shouldReduceMotion = useReducedMotion();

  // Add scroll-based animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Create multiple parallax layers with different strengths
  const parallaxLayer1 = useTransform(
    scrollY,
    [0, 1000],
    [0, shouldReduceMotion ? 0 : -150]
  );
  const parallaxLayer2 = useTransform(
    scrollY,
    [0, 1000],
    [0, shouldReduceMotion ? 0 : -100]
  );
  const parallaxLayer3 = useTransform(
    scrollY,
    [0, 1000],
    [0, shouldReduceMotion ? 0 : -50]
  );

  // Create new parallax layers for different sections
  const featuresBgLayer = useTransform(
    scrollY,
    [300, 1000],
    [0, shouldReduceMotion ? 0 : -80]
  );
  const featuresHeaderLayer = useTransform(
    scrollY,
    [400, 800],
    [0, shouldReduceMotion ? 0 : -40]
  );
  const featuresContentLayer = useTransform(
    scrollY,
    [500, 900],
    [0, shouldReduceMotion ? 0 : -20]
  );

  // Add more parallax layers for different sections
  const howItWorksBgLayer = useTransform(
    scrollY,
    [800, 1600],
    [0, shouldReduceMotion ? 0 : -100]
  );
  const howItWorksHeaderLayer = useTransform(
    scrollY,
    [900, 1500],
    [0, shouldReduceMotion ? 0 : -50]
  );
  const howItWorksContentLayer = useTransform(
    scrollY,
    [1000, 1400],
    [0, shouldReduceMotion ? 0 : -30]
  );

  // Add more parallax layers for the CTA section
  const ctaBgLayer = useTransform(
    scrollY,
    [2000, 2600],
    [0, shouldReduceMotion ? 0 : -120]
  );
  const ctaContentLayer = useTransform(
    scrollY,
    [2100, 2500],
    [0, shouldReduceMotion ? 0 : -60]
  );

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
        className="py-24 md:py-32 text-center relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{ opacity: heroOpacity }}
      >
        {/* Multi-layer parallax background */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: parallaxLayer3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-30"></div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-20 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl -z-10"
          style={{ y: parallaxLayer1 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror" as const,
          }}
        />

        <motion.div
          className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl -z-10"
          style={{ y: parallaxLayer2 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror" as const,
            delay: 1,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="mb-12 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="flex gap-3 p-1 justify-center text-6xl md:text-7xl font-bold mb-4 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                نور المعرفة
              </motion.span>
              <motion.div
                animate={floatAnimation.animate}
                initial={floatAnimation.initial}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-2 bg-blue-400/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror" as const,
                  }}
                />
                <Lightbulb className="w-14 h-14 text-blue-500" />
              </motion.div>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              رحلتك نحو القراءة والكتابة تبدأ هنا
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative max-w-md mx-auto"
          >
            <motion.div
              className="absolute -inset-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-xl blur-xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <AudioButton
                size="lg"
                className="relative text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                onAction={handleGetStarted}
                audioSrc="/audio/start-learning.wav"
                immediateAction={true}
              >
                ابدأ التعلم
                <ArrowRightIcon className="mr-2 h-5 w-5" />
              </AudioButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Marquee */}
      <motion.div
        className="bg-gradient-to-r from-muted/10 via-muted/40 to-muted/10 py-6 overflow-hidden border-y border-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-[url('/noise.png')] opacity-10 z-0 pointer-events-none"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />
          <Marquee className="py-3" pauseOnHover={true}>
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center mx-10 px-7 py-4 bg-gradient-to-r from-card/80 to-card/95 shadow-sm rounded-full border border-primary/15 hover:border-primary/40 transition-all duration-300 hover:shadow-md"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 mr-4 shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base font-medium">{item.text}</span>
              </motion.div>
            ))}
          </Marquee>
        </div>
      </motion.div>

      {/* Features with staggered animation */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-muted/0 -z-10"></div>

        {/* Floating background elements with parallax effect */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden"
          style={{ y: featuresBgLayer }}
        >
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />
          <motion.div
            className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror" as const,
              delay: 2,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header with enhanced parallax motion */}
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ y: featuresHeaderLayer }}
          >
            <motion.div
              className="inline-block mb-3 px-5 py-1 bg-primary/10 rounded-full text-primary/90 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              مميزات فريدة
            </motion.div>

            {/* Replace character-by-character animation with simple h2 */}
            <motion.h2
              className="text-4xl font-bold mb-4"
              variants={textAnimateUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              مميزات التطبيق
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={textAnimateUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              تطبيق يجمع بين التكنولوجيا المتطورة وسهولة الاستخدام لتعليم
              القراءة والكتابة
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 md:gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ y: featuresContentLayer }}
          >
            <motion.div
              className="bg-gradient-to-b from-card to-card/90 p-8 rounded-2xl shadow-md border border-primary/5 hover:border-primary/30 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Enhanced background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-64 h-64 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
              </div>

              <motion.div
                className="mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-500 shadow-md"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <BookOpenIcon className="h-8 w-8 text-primary" />
              </motion.div>

              {/* Animate text from left to right (RTL appropriate) */}
              <motion.h3
                className="text-2xl font-semibold mb-3 overflow-hidden"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                تعلم الأبجدية العربية
              </motion.h3>

              <motion.p
                className="text-muted-foreground text-base"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                تعلم الحروف العربية من الألف إلى الياء بطريقة تفاعلية ومبسطة
                تناسب جميع المستويات
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-b from-card to-card/90 p-8 rounded-2xl shadow-md border border-primary/5 hover:border-primary/30 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Enhanced background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-64 h-64 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
              </div>

              <motion.div
                className="mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-500 shadow-md"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <BookTextIcon className="h-8 w-8 text-primary" />
              </motion.div>

              {/* Animate text from left to right (RTL appropriate) */}
              <motion.h3
                className="text-2xl font-semibold mb-3 overflow-hidden"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                تعلم الأرقام
              </motion.h3>

              <motion.p
                className="text-muted-foreground text-base"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                تعلم الأرقام والعد بطريقة سهلة ومدعومة بالصوت والصور تجعل التعلم
                ممتعاً وفعالاً
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-b from-card to-card/90 p-8 rounded-2xl shadow-md border border-primary/5 hover:border-primary/30 relative overflow-hidden group"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Enhanced background decorative element */}
              <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 right-0 rounded-full w-64 h-64 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
              </div>

              <motion.div
                className="mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-500 shadow-md"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <BrainCircuitIcon className="h-8 w-8 text-primary" />
              </motion.div>

              {/* Animate text from left to right (RTL appropriate) */}
              <motion.h3
                className="text-2xl font-semibold mb-3 overflow-hidden"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                ذكاء اصطناعي
              </motion.h3>

              <motion.p
                className="text-muted-foreground text-base"
                variants={textAnimateRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                تقنيات الذكاء الاصطناعي لتحسين التعلم وتخصيص التجربة حسب
                احتياجات كل متعلم
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works with interactive steps - enhanced */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent opacity-70"></div>
          {/* Parallax floating elements */}
          <motion.div
            className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            style={{
              x: useTransform(scrollY, [800, 1400], [0, 30]),
              y: howItWorksBgLayer,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />
          <motion.div
            className="absolute left-0 bottom-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            style={{
              x: useTransform(scrollY, [800, 1400], [0, -30]),
              y: howItWorksBgLayer,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "mirror" as const,
              delay: 1,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header with scroll-triggered animations */}
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ y: howItWorksHeaderLayer }}
          >
            <motion.div
              className="inline-block mb-3 px-5 py-1 bg-primary/10 rounded-full text-primary/90 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              خطوات بسيطة
            </motion.div>

            {/* Replace character-by-character animation with simple h2 */}
            <motion.h2
              className="text-4xl font-bold mb-4"
              variants={textAnimateUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              كيف يعمل التطبيق؟
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={textAnimateUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              ثلاث خطوات سهلة تبدأ بها رحلتك نحو تعلم القراءة والكتابة
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 md:gap-16 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ y: howItWorksContentLayer }}
          >
            {/* Connecting lines between steps with animation */}
            <motion.div
              className="absolute top-1/2 left-1/3 right-2/3 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            />

            <motion.div
              className="absolute top-1/2 left-2/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            />

            <motion.div
              className="text-center relative"
              variants={stepVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-6 mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary shadow-lg border border-primary/20"
                whileHover={{
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                    "0 0 20px rgba(59, 130, 246, 0.2)",
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror" as const,
                }}
              >
                ١
              </motion.div>

              <motion.h3
                className="text-2xl font-semibold mb-3"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                سجل حساب
              </motion.h3>

              <motion.p
                className="text-muted-foreground"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                أنشئ حساب بالصوت أو الكتابة بكل سهولة
                <br />
                وابدأ رحلتك التعليمية
              </motion.p>
            </motion.div>

            <motion.div
              className="text-center relative"
              variants={stepVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-6 mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary shadow-lg border border-primary/20"
                whileHover={{
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                    "0 0 20px rgba(59, 130, 246, 0.2)",
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror" as const,
                  delay: 1.3,
                }}
              >
                ٢
              </motion.div>

              <motion.h3
                className="text-2xl font-semibold mb-3"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                اختر الدروس
              </motion.h3>

              <motion.p
                className="text-muted-foreground"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                حدد ما تريد تعلمه من حروف وأرقام وكلمات
                <br />
                بما يناسب احتياجاتك
              </motion.p>
            </motion.div>

            <motion.div
              className="text-center relative"
              variants={stepVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-6 mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary shadow-lg border border-primary/20"
                whileHover={{
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                    "0 0 20px rgba(59, 130, 246, 0.2)",
                    "0 0 0px rgba(59, 130, 246, 0.1)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror" as const,
                  delay: 2.6,
                }}
              >
                ٣
              </motion.div>

              <motion.h3
                className="text-2xl font-semibold mb-3"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                ابدأ التعلم
              </motion.h3>

              <motion.p
                className="text-muted-foreground"
                variants={textAnimateUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                تمتع بتجربة تعليمية تفاعلية مدعومة بالصوت
                <br />
                وتعلم بسرعة وسهولة
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target audience with enhanced styling and parallax effects */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/30 to-muted/0 -z-10"></div>

        {/* Parallax background elements */}
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ y: useTransform(scrollY, [1400, 2000], [0, -50]) }}
        >
          <motion.div
            className="absolute -top-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
            animate={{
              opacity: [0.15, 0.3, 0.15],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror" as const,
              delay: 3,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ y: useTransform(scrollY, [1500, 1800], [0, -20]) }}
          >
            <motion.div
              className="inline-block mb-3 px-5 py-1 bg-primary/10 rounded-full text-primary/90 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              الفئات المستهدفة
            </motion.div>
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              لمن هذا التطبيق؟
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              تطبيق نور المعرفة مصمم للأشخاص الذين يرغبون في تعلم القراءة
              والكتابة باللغة العربية
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                className="flex items-start p-6 bg-card rounded-2xl shadow-md border border-primary/10 hover:border-primary/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="ml-5 shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-md">
                    <Users2Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    البالغين الأميين
                  </h3>
                  <p className="text-muted-foreground">
                    الذين يرغبون في اكتساب مهارات القراءة والكتابة لتحسين فرصهم
                    في العمل والحياة اليومية
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start p-6 bg-card rounded-2xl shadow-md border border-primary/10 hover:border-primary/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="ml-5 shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-md">
                    <GraduationCapIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    المتعلمين المبتدئين
                  </h3>
                  <p className="text-muted-foreground">
                    الذين يحتاجون إلى تعلم أساسيات اللغة العربية بطريقة مبسطة
                    وتفاعلية تناسب قدراتهم
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-gradient-to-b from-card/95 to-card/80 p-8 shadow-lg border border-primary/10 relative overflow-hidden"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute -z-10 top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10 mx-auto">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>

              <blockquote className="text-lg relative">
                <motion.div
                  className="absolute -z-10 opacity-10 text-6xl font-serif right-0 top-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.1 }}
                  viewport={{ once: true }}
                >
                  "
                </motion.div>
                <p className="mb-6 relative z-10">
                  يهدف تطبيق نور المعرفة إلى معالجة تحدي الأمية في مصر من خلال
                  تقديم تجربة تعليمية مبتكرة تعتمد على الصوت واللعب للبالغين
                  الأميين وشبه الأميين.
                </p>
                <p className="font-semibold text-primary/90">
                  باستخدام تقنيات الذكاء الاصطناعي والتفاعل الصوتي، نجعل الخطوات
                  الأولى نحو محو الأمية سهلة ومشجعة قدر الإمكان.
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to action with enhanced animation and parallax */}
      <motion.section
        className="py-24 relative overflow-hidden"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Enhanced parallax background */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: ctaBgLayer }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-primary/5"></div>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />

          {/* Add new decorative elements */}
          <motion.div
            className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-primary/5 blur-2xl"
            style={{ x: useTransform(scrollY, [2000, 2400], [0, 30]) }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror" as const,
            }}
          />

          <motion.div
            className="absolute bottom-1/3 left-10 w-80 h-80 rounded-full bg-primary/5 blur-2xl"
            style={{ x: useTransform(scrollY, [2000, 2400], [0, -30]) }}
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "mirror" as const,
              delay: 1,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center bg-card/80 p-10 md:p-14 rounded-3xl shadow-xl border border-primary/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              y: -5,
              transition: { duration: 0.3 },
            }}
            style={{ y: ctaContentLayer }}
          >
            {/* Add decorative elements */}
            <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ابدأ رحلتك التعليمية الآن
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              variants={textAnimateUp}
            >
              انضم إلى الآلاف من المتعلمين وابدأ رحلتك نحو القراءة والكتابة
              بأساليب حديثة ومبتكرة
            </motion.p>

            <motion.div
              className="flex flex-col md:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded-xl blur-md"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror" as const,
                  }}
                />
                <AudioButton
                  size="lg"
                  className="relative text-lg px-10 py-5 rounded-xl shadow-md hover:shadow-lg transition-all w-full md:w-auto"
                  onAction={() => router.push("/register")}
                  audioSrc="/audio/go-to-register.wav"
                >
                  تسجيل حساب جديد
                </AudioButton>
              </motion.div>

              <AudioButton
                variant="outline"
                size="lg"
                className="text-lg px-10 py-5 rounded-xl hover:bg-primary/5 transition-all duration-300 border-primary/20 hover:border-primary/40"
                onAction={() => router.push("/login")}
                audioSrc="/audio/go-to-login.wav"
              >
                تسجيل الدخول
              </AudioButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer
        className="py-10 border-t border-primary/10 text-center text-muted-foreground relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 -z-10 bg-muted/20 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary/70" />
              <span className="font-medium text-primary/80">نور المعرفة</span>
            </div>
            <span className="hidden md:block text-muted-foreground/50">•</span>
            <span>معاً نحو مستقبل خالٍ من الأمية</span>
          </motion.div>
          <p className="text-sm text-muted-foreground/80">
            © {new Date().getFullYear()} نور المعرفة - جميع الحقوق محفوظة
          </p>
        </div>
      </motion.footer>
    </MainLayout>
  );
}
