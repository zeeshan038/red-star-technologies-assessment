import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/Button";
import Link from "next/link";

export const metadata = {
  title: "Asana Clone | All your work, all in one place",
  description: "Manage projects, track tasks, and collaborate with your team in one unified workspace. The ultimate project management tool.",
};

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-brand-pink selection:text-brand-deep">
      <Navbar />

      <Hero />

      {/* Features Section - Premium landing page feel */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything you need to deliver your best work
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Streamline your workflow, manage team projects, and reach your goals with a unified workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Workspace Management",
                desc: "Create and organize multiple workspaces for different teams or clients.",
                icon: "🏢",
              },
              {
                title: "Project Tracking",
                desc: "Monitor progress with intuitive project boards and status updates.",
                icon: "📊",
              },
              {
                title: "Task Automation",
                desc: "Assign tasks, set due dates, and let our system handle the organization.",
                icon: "⚡",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-brand-deep/5 transition-all duration-500 border border-gray-100 group cursor-default"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 tasktorch-gradient relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/register">
              <Button
                variant="white"
                size="lg"
                className="px-14 py-5 rounded-3xl"
              >
                Try TaskTorch for free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-14 py-5 rounded-3xl border-white/20">
              Talk to sales
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-10 font-bold tracking-widest uppercase">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/60 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tight text-white uppercase italic">TaskTorch</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">The best way for teams to work together and stay organized. Join millions of users worldwide.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Product</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Log in</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <p>© 2025 TaskTorch Project. Assessment Task.</p>
        </div>
      </footer>
    </main>
  );
}
