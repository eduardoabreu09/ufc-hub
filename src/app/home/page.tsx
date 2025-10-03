import { Hero } from "@/components/ui/hero";
import { Gallery } from "@/components/ui/gallery";
import { PostList } from "@/components/ui/post-list";
import { Header } from "@/components/header";

export default function Home() {
  // Sample gallery items
  const galleryItems = [
    {
      id: "gallery-1",
      title: "Student Events",
      summary: "Join campus events and activities throughout the semester.",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
    {
      id: "gallery-2",
      title: "Academic Resources",
      summary: "Access study materials and research guides.",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
    },
    {
      id: "gallery-3",
      title: "Campus Life",
      summary: "Discover campus facilities and student organizations.",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
    },
    {
      id: "gallery-4",
      title: "Career Services",
      summary: "Find internships and job opportunities.",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
  ];

  // Sample blog posts
  const blogPosts = [
    {
      id: "post-1",
      title: "New Student Orientation Guide",
      summary:
        "Everything you need to know for the upcoming semester, including campus resources and academic policies.",
      label: "Student Life",
      author: "Academic Affairs",
      published: "Sep 15, 2025",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
      tags: ["Orientation", "Student Life"],
    },
    {
      id: "post-2",
      title: "Research Opportunities Available",
      summary:
        "Explore exciting research programs across departments. Learn about applications and deadlines.",
      label: "Research",
      author: "Research Office",
      published: "Sep 20, 2025",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
      tags: ["Research", "Academic"],
    },
    {
      id: "post-3",
      title: "Campus Safety Updates",
      summary:
        "Important information on campus safety measures and emergency protocols.",
      label: "Safety",
      author: "Research Office",
      published: "Sep 20, 2025",
      url: "#",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
      tags: ["Research", "Academic"],
    },
  ];
  return (
    <div className="min-h-screen">
      <Header />
      <Hero
        title="Welcome to UFC Hub"
        description="Connect with fellow students, join study groups, and stay updated with university events and announcements."
      />
      <Gallery title="Featured Content" items={galleryItems} />
      <PostList
        title="Latest Updates"
        description="Stay informed with the latest news and announcements from our university community."
        posts={blogPosts}
      />
    </div>
  );
}
