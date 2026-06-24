import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TranslationService } from '../services/translation.service';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function' && component.hasUnsavedChanges()) {
    const translationService = inject(TranslationService);
    const message = translationService.currentLang() === 'ar'
      ? 'لديك تغييرات غير محفوظة. هل تريد مغادرة الصفحة حقاً؟'
      : 'You have unsaved changes. Do you really want to leave?';
    return confirm(message);
  }
  return true;
};
export default unsavedChangesGuard;
