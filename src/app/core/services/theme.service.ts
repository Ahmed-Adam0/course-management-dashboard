import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode.set(savedTheme === 'dark');
      } else {
        // Fallback to system preferred theme
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.set(systemPrefersDark);
      }
      this.updateThemeClass();
    }
  }

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      this.updateThemeClass();
    }
  }

  private updateThemeClass(): void {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode()) {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }
}
export default ThemeService;
