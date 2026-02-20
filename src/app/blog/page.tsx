/* eslint-disable @next/next/no-img-element */
import BlockTitle from "@/components/learning/BlockTitle";
import Footer from "@/components/main/footer";
import Link from "next/link";

const PAGE_SIZE = 6;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPaginationItems(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: Array<number | "..."> = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  items.push(1);
  if (left > 2) items.push("...");
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < total - 1) items.push("...");
  items.push(total);

  return items;
}

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const posts = [
    {
      id: "olympic-games",
      category: "BLOG, CUSTOMS AND TRADITIONS",
      title: "Olympic Games in Spanish Speaking Countries",
      excerpt:
        "The Olympic Games have provided a stage for Spanish-speaking countries to showcase their athletic prowess and cultural diversity.",
      date: "August 7, 2024",
      img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "summer-activities",
      category: "BLOG, EXTRA CURRICULUM",
      title: "Summer Spanish Activities for Kids",
      excerpt:
        "Explore a variety of summer Spanish activities for kids, designed to blend fun and language learning in a memorable way.",
      date: "July 28, 2024",
      img: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&w=1200&q=80",
    },
    // More placeholder posts so pagination makes sense
    {
      id: "pronunciation-games",
      category: "BLOG, LEARNING TIPS",
      title: "Pronunciation Games You Can Play at Home",
      excerpt:
        "Simple, fun activities that help kids practice sounds, stress, and rhythm in short daily sessions.",
      date: "June 10, 2024",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "food-vocab",
      category: "BLOG, FOOD AND DISHES",
      title: "Food Vocabulary Kids Actually Use",
      excerpt:
        "Build a practical food word bank with mini missions, pictures, and quick speaking prompts.",
      date: "May 24, 2024",
      img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "songs-and-chants",
      category: "BLOG, ENTERTAINMENT",
      title: "Songs & Chants for Faster Memory",
      excerpt:
        "Catchy patterns make phrases stick. Here are short routines you can repeat every week.",
      date: "April 19, 2024",
      img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "weekend-routine",
      category: "BLOG, OUR METHOD",
      title: "A Weekend Routine That Works",
      excerpt:
        "A simple plan for weekends: 10 minutes vocab, 10 minutes speaking, 5 minutes review.",
      date: "March 30, 2024",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "travel-phrases",
      category: "BLOG, TRAVELLING AND LEISURE",
      title: "Travel Phrases for Confident Speaking",
      excerpt:
        "Practice real phrases for greetings, directions, and ordering—perfect for role play missions.",
      date: "February 12, 2024",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "customs-holidays",
      category: "BLOG, CUSTOMS AND TRADITIONS",
      title: "Holidays: Culture Meets Language",
      excerpt:
        "Use short stories and picture prompts to introduce culture while practicing core sentences.",
      date: "January 5, 2024",
      img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "reading-for-kids",
      category: "BLOG, LEARNING TIPS",
      title: "Reading Tips for Young Learners",
      excerpt:
        "How to pick the right level and keep it fun with micro-goals and quick comprehension checks.",
      date: "December 9, 2023",
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "classroom-phrases",
      category: "BLOG, OUR METHOD",
      title: "Classroom Phrases That Build Fluency",
      excerpt:
        "Repeat these core phrases every lesson to help students speak without translating.",
      date: "November 11, 2023",
      img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "sports-vocab",
      category: "BLOG, ENTERTAINMENT",
      title: "Sports Vocabulary Mini Missions",
      excerpt:
        "Fast activities that connect sports words to speaking prompts and short listening tasks.",
      date: "October 20, 2023",
      img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categories = [
    "Our Method",
    "Learning Tips",
    "Extra Curriculum",
    "Entertainment",
    "Customs and Traditions",
    "Food and Dishes",
    "Travelling and Leisure",
  ];

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const currentPage = clamp(Number(searchParams?.page ?? 1) || 1, 1, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(pageStart, pageStart + PAGE_SIZE);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <main className="min-h-screen">
      {/* Full-width blog hero (like screenshot, no images) */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          {/* subtle “skyline” bars (CSS only) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] opacity-30">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 10px, rgba(0,0,0,0.25) 10px 26px)",
              }}
            />
          </div>

          {/* spotlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(700px 260px at 50% 45%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)",
            }}
          />

          <div className="relative max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-14 md:py-20 min-h-[240px] md:min-h-[320px] flex items-center justify-center">
            <div className="text-center">
              <BlockTitle text="George's club" className="mx-auto" />
              <BlockTitle text="News" className="mx-auto mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog list + sidebar (like screenshot) */}
      <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
          {/* Posts */}
          <div className="grid gap-8 md:grid-cols-2 justify-items-center">
            {pagePosts.map((p) => (
              <article
                key={p.id}
                className="w-full max-w-[420px] border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-white"
              >
                <div className="relative h-[190px] md:h-[220px]">
                  <img src={p.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#000237]/10" aria-hidden="true" />
                </div>

                <div className="px-5 md:px-6 py-6 md:py-7 text-center">
                  <div className="text-[#3B82F6] text-[11px] tracking-[0.20em] font-semibold">
                    {p.category}
                  </div>
                  <h3 className="mt-3 text-[#212429] text-lg md:text-xl font-extrabold leading-snug">
                    {p.title}
                  </h3>
                  <div className="mx-auto mt-3 h-[2px] w-14 bg-[#E5E7EB]" />
                  <p className="mt-3 text-[#212429]/70 text-sm leading-7">
                    {p.excerpt}
                  </p>

                  <div className="mt-5 flex justify-center">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center min-w-[140px] px-5 py-2 rounded-md border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors text-sm"
                    >
                      Read more
                    </a>
                  </div>

                  <div className="mx-auto mt-5 h-[1px] w-full bg-[#E5E7EB]" />
                  <div className="mt-3 text-[#3B82F6] text-xs">{p.date}</div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
              <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <h3 className="text-white text-lg md:text-xl font-extrabold">Blog categories</h3>
                <div className="mt-4 space-y-2">
                  {categories.map((c) => (
                    <a
                      key={c}
                      href="#"
                      className="block text-white/90 hover:text-white underline-offset-2 hover:underline text-sm"
                    >
                      {c}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-white">
              <div className="px-6 md:px-8 py-7">
                <h3 className="text-[#212429] text-lg md:text-xl font-extrabold">Posts by date</h3>
                <div className="mt-4">
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    defaultValue="Select Month"
                  >
                    <option disabled>Select Month</option>
                    <option>August 2024</option>
                    <option>July 2024</option>
                    <option>June 2024</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <nav
            aria-label="Pagination"
            className="border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-white"
          >
            <div className="flex items-center gap-1 px-3 py-3">
              <Link
                href={`/blog?page=${Math.max(1, currentPage - 1)}`}
                aria-disabled={currentPage === 1}
                className={[
                  "px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm",
                  currentPage === 1
                    ? "text-[#212429]/40 bg-[#F3F4F6] cursor-not-allowed pointer-events-none"
                    : "text-[#212429] bg-white hover:bg-[#CB4913]/10",
                ].join(" ")}
              >
                Prev
              </Link>

              {paginationItems.map((it, idx) => {
                if (it === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-[#212429]/50 select-none"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  );
                }

                const active = it === currentPage;
                return (
                  <Link
                    key={it}
                    href={`/blog?page=${it}`}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "min-w-[40px] text-center px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm",
                      active ? "bg-[#CB4913] text-white" : "bg-white text-[#212429] hover:bg-[#CB4913]/10",
                    ].join(" ")}
                  >
                    {it}
                  </Link>
                );
              })}

              <Link
                href={`/blog?page=${Math.min(totalPages, currentPage + 1)}`}
                aria-disabled={currentPage === totalPages}
                className={[
                  "px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm",
                  currentPage === totalPages
                    ? "text-[#212429]/40 bg-[#F3F4F6] cursor-not-allowed pointer-events-none"
                    : "text-[#212429] bg-white hover:bg-[#CB4913]/10",
                ].join(" ")}
              >
                Next
              </Link>
            </div>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  );
}

