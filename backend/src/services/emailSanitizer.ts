import sanitizeHtml from 'sanitize-html';

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img',
    'div', 'span',
    'abbr', 'cite', 'q',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    td: ['colspan', 'rowspan', 'style'],
    th: ['colspan', 'rowspan', 'style'],
    div: ['style'],
    span: ['style'],
    p: ['style'],
    h1: ['style'], h2: ['style'], h3: ['style'],
    h4: ['style'], h5: ['style'], h6: ['style'],
    table: ['style'],
  },
  allowedStyles: {
    '*': {
      'color': [/.*/],
      'background-color': [/.*/],
      'text-align': [/.*/],
      'font-weight': [/.*/],
      'font-style': [/.*/],
      'text-decoration': [/.*/],
      'margin': [/.*/],
      'padding': [/.*/],
      'border': [/.*/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    'img': sanitizeHtml.simpleTransform('img', { style: 'max-width:100%;height:auto;' }),
  },
  disallowedTagsMode: 'discard',
};

export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, sanitizeOptions);
}

export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
