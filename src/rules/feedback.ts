/**
 * Feedback UX Rules
 *
 * Rules for user feedback components like alerts, toasts, spinners, and progress.
 */

import type { AnyNode } from '@wireweave/core';
import type { UXRule, UXRuleContext, UXIssue } from '../types';

/**
 * Check if spinner has context text
 */
export const spinnerHasContext: UXRule = {
  id: 'feedback-spinner-context',
  category: 'feedback',
  severity: 'info',
  name: 'Spinner should have context',
  description: 'Loading spinners should indicate what is being loaded',
  appliesTo: ['Spinner'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const hasText = 'text' in node && node.text;
    const hasLabel = 'label' in node && node.label;
    const hasContent = 'content' in node && node.content;

    // Check if there's sibling text that might provide context
    const siblingText = context.siblings.some(
      (s: AnyNode) => s.type === 'Text' && 'content' in s && String(s.content || '').toLowerCase().includes('loading')
    );

    if (!hasText && !hasLabel && !hasContent && !siblingText) {
      return {
        ruleId: 'feedback-spinner-context',
        category: 'feedback',
        severity: 'info',
        message: 'Spinner has no loading text',
        description: 'Users benefit from knowing what is being loaded',
        suggestion: 'Add a text/label attribute like "Loading..." or "Please wait..."',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check if progress bar has value indicator
 */
export const progressHasValue: UXRule = {
  id: 'feedback-progress-value',
  category: 'feedback',
  severity: 'info',
  name: 'Progress should show value',
  description: 'Progress bars should indicate completion percentage',
  appliesTo: ['Progress'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const hasValue = 'value' in node;
    const hasPercent = 'percent' in node;
    const isIndeterminate = 'indeterminate' in node && node.indeterminate;

    // Indeterminate progress bars don't need a value
    if (isIndeterminate) return null;

    if (!hasValue && !hasPercent) {
      return {
        ruleId: 'feedback-progress-value',
        category: 'feedback',
        severity: 'info',
        message: 'Progress bar has no value specified',
        description: 'Users should see how much progress has been made',
        suggestion: 'Add a value attribute (0-100) or use indeterminate for unknown duration',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check if toast has appropriate duration
 */
export const toastDuration: UXRule = {
  id: 'feedback-toast-duration',
  category: 'feedback',
  severity: 'info',
  name: 'Toast should have appropriate duration',
  description: 'Toasts should auto-dismiss after a reasonable time',
  appliesTo: ['Toast'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const duration = 'duration' in node ? Number(node.duration) : null;
    const MIN_DURATION = 2000; // 2 seconds
    const MAX_DURATION = 10000; // 10 seconds

    if (duration !== null) {
      if (duration < MIN_DURATION) {
        return {
          ruleId: 'feedback-toast-duration',
          category: 'feedback',
          severity: 'info',
          message: `Toast duration (${duration}ms) may be too short to read`,
          description: 'Users need time to read toast messages',
          suggestion: `Increase duration to at least ${MIN_DURATION}ms`,
          path: context.path,
          nodeType: node.type,
          location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
        };
      }
      if (duration > MAX_DURATION) {
        return {
          ruleId: 'feedback-toast-duration',
          category: 'feedback',
          severity: 'info',
          message: `Toast duration (${duration}ms) may be too long`,
          description: 'Long-lasting toasts can be annoying and block UI',
          suggestion: `Consider reducing duration or using a persistent alert instead`,
          path: context.path,
          nodeType: node.type,
          location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
        };
      }
    }
    return null;
  },
};

/**
 * Check if alert has dismissible option for non-critical alerts
 */
export const alertDismissible: UXRule = {
  id: 'feedback-alert-dismissible',
  category: 'feedback',
  severity: 'info',
  name: 'Non-critical alerts should be dismissible',
  description: 'Info and success alerts should be dismissible by users',
  appliesTo: ['Alert'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const variant = 'variant' in node ? String(node.variant || '') : '';
    const isDismissible = 'dismissible' in node || 'closable' in node || 'onClose' in node;

    // Error/danger alerts might need to stay visible
    if (variant === 'danger' || variant === 'error') return null;

    // Info and success alerts should generally be dismissible
    if ((variant === 'info' || variant === 'success') && !isDismissible) {
      return {
        ruleId: 'feedback-alert-dismissible',
        category: 'feedback',
        severity: 'info',
        message: `${variant} alert is not dismissible`,
        description: 'Users should be able to dismiss non-critical alerts',
        suggestion: 'Add dismissible or closable attribute to allow users to close the alert',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check if tooltip has reasonable content length
 */
export const tooltipContentLength: UXRule = {
  id: 'feedback-tooltip-length',
  category: 'feedback',
  severity: 'info',
  name: 'Tooltip content should be brief',
  description: 'Tooltips should be short and helpful',
  appliesTo: ['Tooltip'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_TOOLTIP_LENGTH = 100;
    const content = 'content' in node ? String(node.content || '') : '';
    const text = 'text' in node ? String(node.text || '') : '';
    const tooltipText = content || text;

    if (tooltipText.length > MAX_TOOLTIP_LENGTH) {
      return {
        ruleId: 'feedback-tooltip-length',
        category: 'feedback',
        severity: 'info',
        message: `Tooltip is ${tooltipText.length} characters (recommended max: ${MAX_TOOLTIP_LENGTH})`,
        description: 'Long tooltips are hard to read and may disappear before being fully read',
        suggestion: 'Keep tooltips brief or use a popover for longer content',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check if form has error feedback capability
 */
export const formErrorFeedback: UXRule = {
  id: 'feedback-form-errors',
  category: 'feedback',
  severity: 'info',
  name: 'Form should handle errors',
  description: 'Forms should have a way to display validation errors',
  appliesTo: ['Card', 'Section', 'Modal'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Check if this looks like a form container
    let hasInputs = false;
    let hasErrorDisplay = false;

    function checkChildren(children: AnyNode[]) {
      for (const child of children) {
        // Form inputs
        if (['Input', 'Textarea', 'Select'].includes(child.type)) {
          hasInputs = true;
          // Check if input has error prop
          if ('error' in child || 'errorText' in child || 'helperText' in child) {
            hasErrorDisplay = true;
          }
        }
        // Error display components
        if (child.type === 'Alert' && 'variant' in child) {
          const variant = String(child.variant || '');
          if (variant === 'error' || variant === 'danger') {
            hasErrorDisplay = true;
          }
        }
        if (child.type === 'Text' && 'content' in child) {
          const content = String(child.content || '').toLowerCase();
          if (content.includes('error') || content.includes('invalid')) {
            hasErrorDisplay = true;
          }
        }
        if ('children' in child && Array.isArray(child.children)) {
          checkChildren(child.children as AnyNode[]);
        }
      }
    }

    checkChildren(node.children as AnyNode[]);

    // Only warn if it looks like a form but has no error handling
    if (hasInputs && !hasErrorDisplay) {
      return {
        ruleId: 'feedback-form-errors',
        category: 'feedback',
        severity: 'info',
        message: 'Form area has no visible error handling',
        description: 'Users need to see validation errors when they occur',
        suggestion: 'Add error/errorText attributes to inputs or include an Alert for form-level errors',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * All feedback rules
 */
export const feedbackRules: UXRule[] = [
  spinnerHasContext,
  progressHasValue,
  toastDuration,
  alertDismissible,
  tooltipContentLength,
  formErrorFeedback,
];
