# -*- coding: utf-8 -*-

import pytest

from astroid.test_utils import extract_node
from pylint.testutils import CheckerTestCase, Message

from translations_checker.translations_checker import TranslationsChecker

class TestTranslationsChecker(CheckerTestCase):
	CHECKER_CLASS = TranslationsChecker

	def test_regular_functions_call(self):
		code = """
			func('Some string ' + 'plus some other string')
			func('<a href="#">HTML markup</a>')
			func('кек')
		"""
		node = extract_node(code)

		with self.assertNoMessages():
			self.checker.visit_callfunc(node)

	def test_normal_translation_cases(self):
		code = """
			_('Normal case')
			_('Normal case \{variable\}').format(variable=42)
			_('Normal case ' + 'string')
			_('Some special chars <>/\:;.,~“”-–——_\\'`"$!?@#%^&*()[]\{\}=+')
			_(u'Some unicode string with special chars <>/\:;.,~\u2019\u201c\u201d\u002d\u2013\u2014\u005f\\'`"$!?@#%^&*()[]\{\}=+')
		"""
		node = extract_node(code)

		with self.assertNoMessages():
			self.checker.visit_callfunc(node)

	def test_non_latin_string(self):
		code = """
			_('кек')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-non-latin-string', node=node)):
			self.checker.visit_callfunc(node)

	def test_html_string(self):
		code = """
			_('<h1>Some html in translations</h1>')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-html-string', node=node)):
			self.checker.visit_callfunc(node)

	def test_html_with_non_latin_string(self):
		code = """
			_('<h1>кек</h1>')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(
			Message('translation-of-html-string', node=node),
			Message('translation-of-non-latin-string', node=node)
		):
			self.checker.visit_callfunc(node)

	def test_concatenation_with_html(self):
		code = """
			_('Concatenation with ' + '<b>html</b>' + 'hah!')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-html-string', node=node)):
			self.checker.visit_callfunc(node)

	def test_concatenation_with_non_latin_string(self):
		code = """
			_('Concatenation with ' + 'кек' + 'hah!')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-non-latin-string', node=node)):
			self.checker.visit_callfunc(node)

	def test_call_expressions(self):
		code = """
			_("Some string with format \{1\}".format(1))
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-call-expression', node=node)):
			self.checker.visit_callfunc(node)

	def test_variables(self):
		code = """
			_(variable)
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-variable', node=node)):
			self.checker.visit_callfunc(node)


	def test_concatenation_with_variables(self):
		code = """
			_('Some string' + variable)
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-variable', node=node)):
			self.checker.visit_callfunc(node)

	def test_unaccectable_expression(self):
		code = """
			_('Some string' if True else 'Some other')
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-unacceptable-expression', node=node)):
			self.checker.visit_callfunc(node)

	def test_concatenation_unaccectable_expression(self):
		code = """
			_('Some ' + ('Some string' if True else 'Some other'))
		"""
		node = extract_node(code)

		with self.assertAddsMessages(Message('translation-of-unacceptable-expression', node=node)):
			self.checker.visit_callfunc(node)
