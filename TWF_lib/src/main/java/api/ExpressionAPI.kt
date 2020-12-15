package api

import config.CompiledConfiguration
import config.FunctionConfiguration
import expressiontree.*
import numbers.toReal
import platformdependent.abs
import platformdependent.escapeCharacters
import platformdependent.toShortString
import kotlin.math.pow
import kotlin.math.sqrt


fun normalizeExpressionToUsualForm(
        expression: ExpressionNode
) {
    val topExpressionNode = expression.getTopNode()
    topExpressionNode.normalizeNullWeightCommutativeFunctions()
    topExpressionNode.reduceExtraSigns(setOf("+"), setOf("-"))
    topExpressionNode.normilizeSubtructions(FunctionConfiguration())
    topExpressionNode.computeNodeIdsAsNumbersInDirectTraversalAndDistancesToRoot()
}