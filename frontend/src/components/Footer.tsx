export default function Footer() {
  return (
    <>
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  KC
                </div>
                <span className="text-lg font-bold">KubeChatOps</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Manage Kubernetes from chat apps.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Product</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Resources</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Company</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-slate-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-slate-500">
            © 2026 KubeChatOps. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
