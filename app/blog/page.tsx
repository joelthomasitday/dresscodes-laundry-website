import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function BlogPage() {

  const blogPosts = [
    {
      id: 1,
      title: "5 Essential Laundry Tips for Busy Professionals",
      excerpt:
        "Discover time-saving laundry hacks that will keep your work wardrobe looking professional and fresh, even with a hectic schedule.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Priya Thomas",
      date: "2024-01-15",
      category: "Tips & Tricks",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "The Complete Guide to Fabric Care Labels",
      excerpt:
        "Learn to decode those mysterious symbols on your clothing labels and understand what they mean for proper garment care.",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Arun Kumar",
      date: "2024-01-10",
      category: "Education",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Eco-Friendly Laundry: Our Green Initiatives",
      excerpt:
        "Discover how Dresscode Laundry is leading the way in sustainable cleaning practices and what it means for the environment.",
      image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Rajesh Nair",
      date: "2024-01-05",
      category: "Sustainability",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Stain Removal 101: Common Stains and Solutions",
      excerpt:
        "From coffee spills to ink marks, learn professional techniques for removing the most common household stains effectively.",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Priya Thomas",
      date: "2023-12-28",
      category: "Tips & Tricks",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "Seasonal Wardrobe Care: Preparing for Monsoon",
      excerpt:
        "Essential tips for protecting your clothes during Kerala's monsoon season and preventing mold, mildew, and odors.",
      image: "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Arun Kumar",
      date: "2023-12-20",
      category: "Seasonal Care",
      readTime: "5 min read",
    },
    {
      id: 6,
      title: "The Art of Proper Garment Storage",
      excerpt:
        "Professional techniques for storing seasonal clothing, formal wear, and delicate items to maintain their quality and longevity.",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Rajesh Nair",
      date: "2023-12-15",
      category: "Storage Tips",
      readTime: "6 min read",
    },
  ];

  const categories = [
    "All",
    "Tips & Tricks",
    "Education",
    "Sustainability",
    "Seasonal Care",
    "Storage Tips",
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-16 sm:py-20 mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Laundry Care Blog
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Expert tips, industry insights, and helpful guides for all your
            garment care needs
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={
                  category === "All"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-full"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="mb-4 bg-teal-100 text-teal-800">
              Featured Post
            </Badge>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={blogPosts[0].image || "/placeholder.svg"}
                    alt={blogPosts[0].title}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <Badge variant="secondary">{blogPosts[0].category}</Badge>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(blogPosts[0].date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {blogPosts[0].author}
                      </span>
                    </div>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-full"
                    >
                      <Link href={`/blog/${blogPosts[0].id}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Link href={`/blog/${post.id}`}>
                      Read Article <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-teal-100">
            Subscribe to our newsletter for the latest laundry tips, special
            offers, and industry insights
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
