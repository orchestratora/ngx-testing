import { DirectiveIO, TemplateBindings } from './types';

/**
 * @internal
 */
export function genHostCompTpl(
  tag: string,
  io: DirectiveIO,
  content: string = '',
  bindings?: string | {},
): string {
  const inputsTpl = genInputsTpl(io.inputs);
  const outputsTpl = genOutputsTpl(io.outputs);
  const bindingsTpl = bindings
    ? typeof bindings === 'string'
      ? `let-${bindings}`
      : Object.keys(bindings)
          .map(key => `let-${key}${bindings[key] ? `="${bindings[key]}"` : ''}`)
          .join(' ')
    : '';
  return `<${tag} ${inputsTpl} ${outputsTpl} ${bindingsTpl}>${content}</${tag}>`;
}

/**
 * @internal
 */
export function genHostCompTplStar(
  binding: string,
  tag: string,
  io: DirectiveIO,
  content: string = '',
  bindings?: string | {},
): string {
  const inputsTpl = genInputsTplStar(binding, io.inputs, bindings);
  return `<${tag} ${inputsTpl}>${content}</${tag}>`;
}

/**
 * @internal
 */
export function genInputsTplStar(
  binding: string,
  inputs: TemplateBindings,
  bindings?: string | {},
): string {
  const inputsTpl = inputs
    .filter(({ templateName }) => templateName !== binding)
    .map(
      ({ templateName, propName }) =>
        `${templateName.replace(binding, '')}: ${propName}`,
    )
    .join('; ');

  const bindingsTpl = bindings
    ? typeof bindings === 'string'
      ? `let ${bindings}`
      : Object.keys(bindings)
          .map(key => `let ${key}${bindings[key] ? `: ${bindings[key]}` : ''}`)
          .join(', ')
    : '';

  return `*${binding}="${binding}; ${inputsTpl}; ${bindingsTpl}"`;
}

/**
 * @internal
 */
export function genInputsTpl(inputs: TemplateBindings): string {
  return inputs
    .map(({ templateName, propName }) => `[${templateName}]="${propName}"`)
    .join(' ');
}

/**
 * @internal
 */
export function genOutputsTpl(outputs: TemplateBindings): string {
  return outputs
    .map(
      ({ templateName, propName }) => `(${templateName})="${propName}($event)"`,
    )
    .join(' ');
}
