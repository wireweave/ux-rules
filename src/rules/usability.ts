/**
 * Usability UX Rules
 *
 * General usability rules for better user experience.
 */

import type { AnyNode } from '@wireweave/core';
import type { UXRule, UXRuleContext, UXIssue } from '../types';

/**
 * Check for empty containers
 */
export const noEmptyContainers: UXRule = {
  id: 'usability-empty-container',
  category: 'usability',
  severity: 'warning',
  name: 'Avoid empty containers',
  description: 'Containers without content may confuse users or indicate missing content',
  appliesTo: ['Card', 'Section', 'Modal', 'Drawer'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    if (!('children' in node) || !Array.isArray(node.children) || node.children.length === 0) {
      return {
        ruleId: 'usability-empty-container',
        category: 'usability',
        severity: 'warning',
        message: `${node.type} has no content`,
        description: 'Empty containers may represent incomplete design or confuse users',
        suggestion: 'Add content to this container or use a placeholder to indicate intended content',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for clear CTA (Call to Action)
 */
export const clearCTA: UXRule = {
  id: 'usability-clear-cta',
  category: 'usability',
  severity: 'info',
  name: 'Clear call to action',
  description: 'Pages should have a clear primary action for users',
  appliesTo: ['Page'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Look for a primary button anywhere in the page
    let hasPrimaryButton = false;

    function findPrimaryButton(children: AnyNode[]) {
      for (const child of children) {
        if (child.type === 'Button' && 'primary' in child && child.primary) {
          hasPrimaryButton = true;
          return;
        }
        if ('children' in child && Array.isArray(child.children)) {
          findPrimaryButton(child.children as AnyNode[]);
        }
      }
    }

    findPrimaryButton(node.children as AnyNode[]);

    if (!hasPrimaryButton) {
      return {
        ruleId: 'usability-clear-cta',
        category: 'usability',
        severity: 'info',
        message: 'Page has no primary button (CTA)',
        description: 'A clear call-to-action helps guide users to the main action',
        suggestion: 'Add a primary button for the main action on this page',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for loading states
 */
export const loadingStates: UXRule = {
  id: 'usability-loading-states',
  category: 'usability',
  severity: 'info',
  name: 'Consider loading states',
  description: 'Actions that may take time should have loading indicators',
  appliesTo: ['Button'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const content = 'content' in node ? String(node.content || '').toLowerCase() : '';
    const hasLoading = 'loading' in node;
    const isPrimary = 'primary' in node && node.primary;

    // Actions that typically involve async operations
    const asyncActions = ['submit', 'save', 'send', 'upload', 'download', 'export', 'import', 'sync', 'load'];

    if (isPrimary && asyncActions.some(a => content.includes(a)) && !hasLoading) {
      return {
        ruleId: 'usability-loading-states',
        category: 'usability',
        severity: 'info',
        message: `Button "${content}" may need a loading state`,
        description: 'Async actions should show progress to prevent double-clicks and inform users',
        suggestion: 'Consider adding a loading variant for this button when action is in progress',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for destructive action confirmation
 */
export const destructiveActionConfirmation: UXRule = {
  id: 'usability-destructive-confirm',
  category: 'usability',
  severity: 'warning',
  name: 'Destructive actions need confirmation',
  description: 'Destructive actions should have clear warning styling',
  appliesTo: ['Button'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const content = 'content' in node ? String(node.content || '').toLowerCase() : '';
    const isDanger = 'danger' in node && node.danger;

    // Destructive actions
    const destructiveWords = ['delete', 'remove', 'destroy', 'clear', 'reset', 'revoke', 'terminate'];

    if (destructiveWords.some(w => content.includes(w)) && !isDanger) {
      return {
        ruleId: 'usability-destructive-confirm',
        category: 'usability',
        severity: 'warning',
        message: `Destructive action "${content}" should use danger styling`,
        description: 'Users should be visually warned about destructive actions',
        suggestion: 'Add the danger attribute to this button',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check modal has close mechanism
 */
export const modalCloseButton: UXRule = {
  id: 'usability-modal-close',
  category: 'usability',
  severity: 'warning',
  name: 'Modal should have close mechanism',
  description: 'Users should be able to close modals easily',
  appliesTo: ['Modal'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Look for a close button or cancel button
    let hasCloseButton = false;

    function findCloseButton(children: AnyNode[]) {
      for (const child of children) {
        if (child.type === 'Button') {
          const content = 'content' in child ? String(child.content || '').toLowerCase() : '';
          const icon = 'icon' in child ? String(child.icon || '').toLowerCase() : '';
          if (['close', 'cancel', 'dismiss', 'x'].some(w => content.includes(w) || icon.includes(w))) {
            hasCloseButton = true;
            return;
          }
        }
        if (child.type === 'Icon') {
          const name = 'name' in child ? String(child.name || '').toLowerCase() : '';
          if (name === 'x' || name === 'close') {
            hasCloseButton = true;
            return;
          }
        }
        if ('children' in child && Array.isArray(child.children)) {
          findCloseButton(child.children as AnyNode[]);
        }
      }
    }

    findCloseButton(node.children as AnyNode[]);

    if (!hasCloseButton) {
      return {
        ruleId: 'usability-modal-close',
        category: 'usability',
        severity: 'warning',
        message: 'Modal has no visible close button',
        description: 'Users should have a clear way to dismiss the modal',
        suggestion: 'Add a close button (icon "x") or a "Cancel" button',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for excessive nesting depth
 */
export const maxNestingDepth: UXRule = {
  id: 'usability-nesting-depth',
  category: 'usability',
  severity: 'warning',
  name: 'Avoid excessive nesting',
  description: 'Deeply nested layouts can be confusing and hard to maintain',
  appliesTo: ['Row', 'Col', 'Card', 'Section'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_DEPTH = 6;

    if (context.depth > MAX_DEPTH) {
      return {
        ruleId: 'usability-nesting-depth',
        category: 'usability',
        severity: 'warning',
        message: `Component is nested ${context.depth} levels deep (max recommended: ${MAX_DEPTH})`,
        description: 'Excessive nesting makes layouts harder to understand and maintain',
        suggestion: 'Consider flattening the layout or breaking into separate sections',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for too many buttons in a container (decision fatigue)
 */
export const tooManyButtons: UXRule = {
  id: 'usability-too-many-buttons',
  category: 'usability',
  severity: 'warning',
  name: 'Too many buttons in container',
  description: 'Too many buttons can cause decision fatigue for users',
  appliesTo: ['Card', 'Section', 'Row', 'Modal'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_BUTTONS = 5;

    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Count direct button children only (not recursive)
    const buttonCount = (node.children as AnyNode[]).filter(c => c.type === 'Button').length;

    if (buttonCount > MAX_BUTTONS) {
      return {
        ruleId: 'usability-too-many-buttons',
        category: 'usability',
        severity: 'warning',
        message: `Container has ${buttonCount} buttons (recommended max: ${MAX_BUTTONS})`,
        description: 'Too many choices can overwhelm users and slow decision-making',
        suggestion: 'Consider grouping actions in a dropdown or prioritizing the most important actions',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for forms with too many fields
 */
export const tooManyFormFields: UXRule = {
  id: 'usability-too-many-form-fields',
  category: 'usability',
  severity: 'info',
  name: 'Too many form fields',
  description: 'Forms with many fields have higher abandonment rates',
  appliesTo: ['Card', 'Section', 'Main', 'Modal'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_FORM_FIELDS = 10;

    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Count all form fields recursively
    let formFieldCount = 0;
    const formTypes = ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio'];

    function countFormFields(children: AnyNode[]) {
      for (const child of children) {
        if (formTypes.includes(child.type)) {
          formFieldCount++;
        }
        if ('children' in child && Array.isArray(child.children)) {
          countFormFields(child.children as AnyNode[]);
        }
      }
    }

    countFormFields(node.children as AnyNode[]);

    if (formFieldCount > MAX_FORM_FIELDS) {
      return {
        ruleId: 'usability-too-many-form-fields',
        category: 'usability',
        severity: 'info',
        message: `Form area has ${formFieldCount} fields (recommended max: ${MAX_FORM_FIELDS})`,
        description: 'Long forms increase cognitive load and abandonment rates',
        suggestion: 'Consider breaking into multiple steps, using progressive disclosure, or removing optional fields',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for page with too many elements (cognitive overload)
 */
export const tooManyPageElements: UXRule = {
  id: 'usability-page-complexity',
  category: 'usability',
  severity: 'info',
  name: 'Page may be too complex',
  description: 'Pages with too many elements can overwhelm users',
  appliesTo: ['Page'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_ELEMENTS = 50;

    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Count all elements recursively
    let elementCount = 0;

    function countElements(children: AnyNode[]) {
      for (const child of children) {
        elementCount++;
        if ('children' in child && Array.isArray(child.children)) {
          countElements(child.children as AnyNode[]);
        }
      }
    }

    countElements(node.children as AnyNode[]);

    if (elementCount > MAX_ELEMENTS) {
      return {
        ruleId: 'usability-page-complexity',
        category: 'usability',
        severity: 'info',
        message: `Page has ${elementCount} elements (consider if this complexity is necessary)`,
        description: 'Complex pages can be overwhelming and slow to render',
        suggestion: 'Consider splitting into multiple pages, using tabs, or simplifying the layout',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for drawer without proper width
 */
export const drawerWidth: UXRule = {
  id: 'usability-drawer-width',
  category: 'usability',
  severity: 'info',
  name: 'Drawer should have appropriate width',
  description: 'Drawers should have a defined width for consistent UX',
  appliesTo: ['Drawer'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const hasWidth = 'width' in node || 'w' in node;

    if (!hasWidth) {
      return {
        ruleId: 'usability-drawer-width',
        category: 'usability',
        severity: 'info',
        message: 'Drawer has no width specified',
        description: 'Drawers without explicit width may render inconsistently across devices',
        suggestion: 'Add a width attribute (e.g., width="320" or w="80")',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * All usability rules
 */
export const usabilityRules: UXRule[] = [
  noEmptyContainers,
  clearCTA,
  loadingStates,
  destructiveActionConfirmation,
  modalCloseButton,
  maxNestingDepth,
  tooManyButtons,
  tooManyFormFields,
  tooManyPageElements,
  drawerWidth,
];
