export function Footer() {
  return (
    <footer className="mt-auto py-8 bg-primary text-primary-foreground/80 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="font-display text-lg font-bold mb-2 text-white">الموحد © {new Date().getFullYear()}</p>
        <p className="text-sm">أداة بحث في مواقع مشايخ أهل السنة والجماعة</p>
      </div>
    </footer>
  );
}
