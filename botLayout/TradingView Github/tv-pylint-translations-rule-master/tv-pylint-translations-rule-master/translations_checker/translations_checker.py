# -*- coding: utf-8 -*-

import astroid
import six
import re

from pylint.interfaces import IAstroidChecker
from pylint.checkers import BaseChecker, utils


class TranslationsChecker(BaseChecker):
	__implements__ = IAstroidChecker

	name = 'translations_checker'

	BASE_ID = 99

	ERROR_MESSAGES_ID = {
		'variable': 'translation-of-variable',
		'call-expression': 'translation-of-call-expression',
		'unacceptable-expression': 'translation-of-unacceptable-expression',
		'html-string': 'translation-of-html-string',
		'non-latin-string': 'translation-of-non-latin-string',
	}

	msgs = {
		'E%d01' % BASE_ID: (
			"Variables is not allowed in i18n function",
			ERROR_MESSAGES_ID['variable'],
			"i18n functions must be called with a literal string",
		),
		'E%d02' % BASE_ID: (
			"Call expressions is not allowed in i18n function",
			ERROR_MESSAGES_ID['call-expression'],
			"i18n functions must be called with a literal string",
		),
		'E%d03' % BASE_ID: (
			"Unacceptable expression in i18n function",
			ERROR_MESSAGES_ID['unacceptable-expression'],
			"i18n functions must be called with a literal string",
		),
		'E%d04' % BASE_ID: (
			"HTML is not allowed in i18n function",
			ERROR_MESSAGES_ID['html-string'],
			"i18n functions must be called with a literal string",
		),
		'E%d05' % BASE_ID: (
			"Non-Latin strings is not allowed in i18n function",
			ERROR_MESSAGES_ID['non-latin-string'],
			"i18n functions must be called with a literal string",
		),
	}

	options = ()

	priority = -1

	TRANSLATION_FUNCTIONS = set([
		'_',
		'gettext',
		'ngettext',
		'ngettext_lazy',
		'npgettext',
		'npgettext_lazy',
		'pgettext',
		'pgettext_lazy',
		'ugettext',
		'ugettext_lazy',
		'ugettext_noop',
		'ungettext',
		'ungettext_lazy',
	])

	NON_LATIN_CHARS_RE = re.compile(r"([^a-z^A-Z^\d^\s^<^>^/^\\^\|^\:^\;^\.^\,^\~^\’^\“^\”^\-^\–^\—^\_^\'^\`^\"^\$^!^?^@^#^%^&^*^(^)^\[^\]^\{^\}^=^+]+)", re.UNICODE | re.MULTILINE)
	UNICODE_NON_LATIN_CHARS_RE = re.compile(ur"([^a-z^A-Z^\d^\s^<^>^/^\\^\|^\:^\;^\.^\,^\~^\’^\“^\”^\-^\–^\—^\_^\'^\`^\"^\$^!^?^@^#^%^&^*^(^)^\[^\]^\{^\}^=^+]+)", re.UNICODE | re.MULTILINE)
	HTML_TAGS_RE = re.compile(r"<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>")


	def visit_callfunc(self, node):
		if not isinstance(node.func, astroid.Name) \
			or node.func.name not in self.TRANSLATION_FUNCTIONS \
			or len(node.args) == 0:
			return

		argument = node.args[0]
		self.current_func_node = node;

		if isinstance(argument, astroid.BinOp):
			self._check_binop(argument)
		else:
			self._check_translation(argument)


	def _check_translation(self, node):
		if isinstance(node, astroid.Name):
			self.add_message(self.ERROR_MESSAGES_ID['variable'], node=self.current_func_node)
			return

		if isinstance(node, astroid.CallFunc):
			self.add_message(self.ERROR_MESSAGES_ID['call-expression'], node=self.current_func_node)
			return

		if isinstance(node, astroid.Const) and isinstance(node.value, six.string_types):
			if self.HTML_TAGS_RE.search(node.value):
				self.add_message(self.ERROR_MESSAGES_ID['html-string'], node=self.current_func_node)
			if isinstance(node.value, str) and self.NON_LATIN_CHARS_RE.search(node.value):
				self.add_message(self.ERROR_MESSAGES_ID['non-latin-string'], node=self.current_func_node)
			if isinstance(node.value, unicode) and self.UNICODE_NON_LATIN_CHARS_RE.search(node.value):
				self.add_message(self.ERROR_MESSAGES_ID['non-latin-string'], node=self.current_func_node)
			return

		self.add_message(self.ERROR_MESSAGES_ID['unacceptable-expression'], node=self.current_func_node)


	def _check_binop(self, node):
		if isinstance(node, astroid.BinOp):
			self._check_binop(node.left)
			self._check_binop(node.right)
		else:
			self._check_translation(node)

def register(linter):
	linter.register_checker(TranslationsChecker(linter))
