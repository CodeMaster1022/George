import Footer from "@/components/main/footer";
import TeacherRegisterClient from "@/components/learning/teacher/TeacherRegisterClient";

export default function TeacherRegisterPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 p-left p-right py-12 md:py-16">
        <TeacherRegisterClient />
      </section>
      <Footer />
    </main>
  );
}

