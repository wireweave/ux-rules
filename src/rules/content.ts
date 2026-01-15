/**
 * Content UX Rules
 *
 * Rules for ensuring good content quality and text UX.
 */

import type { AnyNode } from '@wireweave/core';
import type { UXRule, UXRuleContext, UXIssue } from '../types';

/**
 * Check for empty text content
 */
export const emptyTextContent: UXRule = {
  id: 'content-empty-text',
  category: 'content',
  severity: 'warning',
  name: 'Avoid empty text content',
  description: 'Text elements should have meaningful content',
  appliesTo: ['Text', 'Title', 'Label'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const content = 'content' in node ? String(node.content || '') : '';
    const trimmed = content.trim();

    if (trimmed === '' || trimmed === '...' || trimmed === 'Lorem ipsum') {
      return {
        ruleId: 'content-empty-text',
        category: 'content',
        severity: 'warning',
        message: `${node.type} has placeholder or empty content`,
        description: 'Placeholder text should be replaced with meaningful content',
        suggestion: 'Replace with actual content or remove if not needed',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for button text that is too long
 */
export const buttonTextLength: UXRule = {
  id: 'content-button-text-length',
  category: 'content',
  severity: 'info',
  name: 'Button text should be concise',
  description: 'Button labels should be short and action-oriented',
  appliesTo: ['Button'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_BUTTON_TEXT = 25;
    const content = 'content' in node ? String(node.content || '') : '';

    if (content.length > MAX_BUTTON_TEXT) {
      return {
        ruleId: 'content-button-text-length',
        category: 'content',
        severity: 'info',
        message: `Button text is ${content.length} characters (recommended max: ${MAX_BUTTON_TEXT})`,
        description: 'Long button text can be hard to read and may not fit on smaller screens',
        suggestion: 'Use concise, action-oriented text (e.g., "Save" instead of "Click here to save your changes")',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for title/heading that is too long
 */
export const titleLength: UXRule = {
  id: 'content-title-length',
  category: 'content',
  severity: 'info',
  name: 'Title should be concise',
  description: 'Titles should be short and descriptive',
  appliesTo: ['Title'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const MAX_TITLE_LENGTH = 60;
    const content = 'content' in node ? String(node.content || '') : '';

    if (content.length > MAX_TITLE_LENGTH) {
      return {
        ruleId: 'content-title-length',
        category: 'content',
        severity: 'info',
        message: `Title is ${content.length} characters (recommended max: ${MAX_TITLE_LENGTH})`,
        description: 'Long titles can be hard to scan and may get truncated on smaller screens',
        suggestion: 'Shorten the title and move details to a subtitle or description',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for page without a title
 */
export const pageHasTitle: UXRule = {
  id: 'content-page-title',
  category: 'content',
  severity: 'warning',
  name: 'Page should have a title',
  description: 'Every page should have a clear title to orient users',
  appliesTo: ['Page'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    if (!('children' in node) || !Array.isArray(node.children)) {
      return null;
    }

    // Look for a Title component anywhere in the page
    let hasTitle = false;

    function findTitle(children: AnyNode[]) {
      for (const child of children) {
        if (child.type === 'Title') {
          hasTitle = true;
          return;
        }
        if ('children' in child && Array.isArray(child.children)) {
          findTitle(child.children as AnyNode[]);
        }
      }
    }

    findTitle(node.children as AnyNode[]);

    if (!hasTitle) {
      return {
        ruleId: 'content-page-title',
        category: 'content',
        severity: 'warning',
        message: 'Page has no title',
        description: 'Users need a clear title to understand the page purpose',
        suggestion: 'Add a Title component to identify the page',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for link with URL but no text
 */
export const linkHasText: UXRule = {
  id: 'content-link-text',
  category: 'content',
  severity: 'error',
  name: 'Link should have text',
  description: 'Links must have visible text for users to understand where they lead',
  appliesTo: ['Link'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const content = 'content' in node ? String(node.content || '').trim() : '';
    const hasChildren = 'children' in node && Array.isArray(node.children) && node.children.length > 0;

    if (!content && !hasChildren) {
      return {
        ruleId: 'content-link-text',
        category: 'content',
        severity: 'error',
        message: 'Link has no visible text or content',
        description: 'Users cannot understand or interact with links that have no text',
        suggestion: 'Add descriptive text to the link',
        path: context.path,
        nodeType: node.type,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      };
    }
    return null;
  },
};

/**
 * Check for placeholder text used as content
 */
export const noPlaceholderContent: UXRule = {
  id: 'content-no-placeholder',
  category: 'content',
  severity: 'warning',
  name: 'Avoid placeholder content',
  description: 'Placeholder text like "Lorem ipsum" should be replaced',
  appliesTo: ['Text', 'Title', 'Label', 'Button'],
  check: (node: AnyNode, context: UXRuleContext): UXIssue | null => {
    const content = 'content' in node ? String(node.content || '').toLowerCase() : '';

    const placeholders = [
      'lorem ipsum',
      'dolor sit amet',
      'placeholder',
      'sample text',
      'text here',
      'enter text',
      'todo',
      'tbd',
      'xxx',
    ];

    for (const placeholder of placeholders) {
      if (content.includes(placeholder)) {
        return {
          ruleId: 'content-no-placeholder',
          category: 'content',
          severity: 'warning',
          message: `${node.type} contains placeholder text "${placeholder}"`,
          description: 'Placeholder text should be replaced before production',
          suggestion: 'Replace with actual content',
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
 * All content rules
 */
export const contentRules: UXRule[] = [
  emptyTextContent,
  buttonTextLength,
  titleLength,
  pageHasTitle,
  linkHasText,
  noPlaceholderContent,
];
