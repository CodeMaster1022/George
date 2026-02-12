import Footer from "@/components/main/footer";
import TeacherLoginClient from "@/components/learning/teacher/TeacherLoginClient";

export default function TeacherLoginPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <TeacherLoginClient />
      </section>
      <Footer />
    </main>
  );
}

