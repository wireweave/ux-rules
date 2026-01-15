/**
 * Usability Rules Tests
 */

import { describe, it, expect } from 'vitest';
import { parse } from '@wireweave/core';
import { validateUX } from '../../src';

describe('Usability Rules', () => {
  describe('usability-empty-container', () => {
    it('should report warning for empty card', () => {
      const doc = parse('page { card { } }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-empty-container');
      expect(issue).toBeDefined();
      expect(issue?.severity).toBe('warning');
    });

    it('should pass for card with content', () => {
      const doc = parse('page { card { text "Hello" } }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-empty-container');
      expect(issue).toBeUndefined();
    });

    it('should check empty section', () => {
      const doc = parse('page { section { } }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-empty-container');
      expect(issue).toBeDefined();
    });

    it('should check empty modal', () => {
      const doc = parse('page { modal { } }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-empty-container');
      expect(issue).toBeDefined();
    });
  });

  describe('usability-clear-cta', () => {
    it('should report info for page without primary button', () => {
      const doc = parse(`
        page {
          text "Welcome"
          button "Click"
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-clear-cta');
      expect(issue).toBeDefined();
      expect(issue?.severity).toBe('info');
    });

    it('should pass for page with primary button', () => {
      const doc = parse(`
        page {
          text "Welcome"
          button "Get Started" primary
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-clear-cta');
      expect(issue).toBeUndefined();
    });

    it('should detect primary button in nested container', () => {
      const doc = parse(`
        page {
          card {
            text "Welcome"
            button "Get Started" primary
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-clear-cta');
      expect(issue).toBeUndefined();
    });
  });

  describe('usability-loading-states', () => {
    it('should report info for submit button without loading state', () => {
      const doc = parse('page { button "Submit" primary }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-loading-states');
      expect(issue).toBeDefined();
      expect(issue?.severity).toBe('info');
    });

    it('should report for upload button', () => {
      const doc = parse('page { button "Upload File" primary }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-loading-states');
      expect(issue).toBeDefined();
    });

    it('should pass for button with loading', () => {
      const doc = parse('page { button "Submit" primary loading }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-loading-states');
      expect(issue).toBeUndefined();
    });

    it('should not check non-async action buttons', () => {
      const doc = parse('page { button "Cancel" primary }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-loading-states');
      expect(issue).toBeUndefined();
    });
  });

  describe('usability-destructive-confirm', () => {
    it('should report warning for delete button without danger style', () => {
      const doc = parse('page { button "Delete" }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-destructive-confirm');
      expect(issue).toBeDefined();
      expect(issue?.severity).toBe('warning');
    });

    it('should pass for delete button with danger style', () => {
      const doc = parse('page { button "Delete" danger }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-destructive-confirm');
      expect(issue).toBeUndefined();
    });

    it('should report for remove button', () => {
      const doc = parse('page { button "Remove Item" }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-destructive-confirm');
      expect(issue).toBeDefined();
    });

    it('should report for reset button', () => {
      const doc = parse('page { button "Reset All" }');
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-destructive-confirm');
      expect(issue).toBeDefined();
    });
  });

  describe('usability-modal-close', () => {
    it('should report warning for modal without close button', () => {
      const doc = parse(`
        page {
          modal {
            title "Dialog"
            text "Content"
            button "Confirm" primary
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-modal-close');
      expect(issue).toBeDefined();
      expect(issue?.severity).toBe('warning');
    });

    it('should pass for modal with close button', () => {
      const doc = parse(`
        page {
          modal {
            title "Dialog"
            text "Content"
            button "Close"
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-modal-close');
      expect(issue).toBeUndefined();
    });

    it('should pass for modal with cancel button', () => {
      const doc = parse(`
        page {
          modal {
            title "Dialog"
            button "Cancel"
            button "Confirm" primary
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-modal-close');
      expect(issue).toBeUndefined();
    });

    it('should pass for modal with X icon', () => {
      const doc = parse(`
        page {
          modal {
            icon "x"
            title "Dialog"
            text "Content"
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-modal-close');
      expect(issue).toBeUndefined();
    });
  });

  describe('usability-nesting-depth', () => {
    it('should report warning for excessive nesting', () => {
      const doc = parse(`
        page {
          card {
            section {
              card {
                row {
                  col {
                    card {
                      row {
                        text "Too deep"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-nesting-depth');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('deep');
    });

    it('should pass for reasonable nesting', () => {
      const doc = parse(`
        page {
          card {
            row {
              col {
                text "OK"
              }
            }
          }
        }
      `);
      const result = validateUX(doc, { categories: ['usability'] });

      const issue = result.issues.find(i => i.ruleId === 'usability-nesting-depth');
      expect(issue).toBeUndefined();
    });
  });
});
