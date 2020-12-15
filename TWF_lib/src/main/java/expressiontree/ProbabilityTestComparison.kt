package expressiontree

import api.compareWithoutSubstitutions
import config.ComparisonType
import config.CompiledConfiguration
import optimizerutils.DomainPointGenerator
import optimizerutils.OptimizerUtils

fun shouldTakeLog(node: ExpressionNode) : Boolean {
    if (node.value.isEmpty()) {
        if (node.children.size == 1)
            return shouldTakeLog(node.children[0])
        return false
    }
    return node.value == "exp" || node.value == "^"
}

fun getLog(node: ExpressionNode, compiledConfiguration: CompiledConfiguration) : ExpressionNode {
    if (node.value.isEmpty()){
        val res = node.clone()
        if (res.children.size == 1)
            res.children[0] = getLog(res.children[0], compiledConfiguration)
        return res
    } else {
        if (node.value == "exp" && node.children.size == 1)
            return node.children[0].clone()
        if (node.value == "^" && node.children.size > 1) {
            val res = compiledConfiguration.createExpressionFunctionNode("*", -1)
            res.addChild(compiledConfiguration.createExpressionFunctionNode("ln", 1))
            res.children[0].addChild(node.children[0].clone())
            if (node.children.size == 2)
                res.addChild(node.children[1].clone())
            else{
                val right = compiledConfiguration.createExpressionFunctionNode("^", -1)
                for (i in 1 until node.children.size)
                    right.addChild(node.children[i].clone())
            }
            return res
        }
    }
    return node.clone()
}

fun alwaysPositiveFunction(node: ExpressionNode) : Boolean {
    if (node.nodeType != NodeType.FUNCTION)
        return false
    if (node.value == "exp" || node.value == "sqrt")
        return true
    val eps = 1e-6
    if (node.value == "^") {
        if (node.children.size == 2) {
            val roundedPower = node.children[1].value.toIntOrNull()
            if (roundedPower != null && (roundedPower % 2 == 0 || node.children[1].value.toDouble() - roundedPower.toDouble() > eps))
                return true
        }
    }
    return false
}

fun difference(left: ExpressionNode, right: ExpressionNode, compiledConfiguration: CompiledConfiguration) : ExpressionNode {
    val res = compiledConfiguration.createExpressionFunctionNode("+", -1)
    res.addChild(left.clone())
    res.addChild(compiledConfiguration.createExpressionFunctionNode("-", -1))
    res.children.last().addChild(right.clone())
    return res
}

fun ratio(num: ExpressionNode, den: ExpressionNode, compiledConfiguration: CompiledConfiguration) : ExpressionNode {
    val res = compiledConfiguration.createExpressionFunctionNode("/", -1)
    res.addChild(num.clone())
    res.addChild(den.clone())
    return res
}

fun alwaysPositive(expression: ExpressionNode, compiledConfiguration: CompiledConfiguration) : Boolean {
    var expressionNode = expression.clone()
    if (expressionNode.value.isEmpty()){
        if (expressionNode.children.size == 1)
            expressionNode = expressionNode.children[0]
    }
    if (expressionNode.nodeType == NodeType.FUNCTION && alwaysPositiveFunction(expressionNode))
        return true
    val expressionMinimizer = OptimizerUtils(difference(expression, compiledConfiguration.createExpressionVariableNode (0.000001), compiledConfiguration))
    if (!expressionMinimizer.canStart() && !expressionMinimizer.run(3))
        return true
    return false
}

fun gradientDescentComparison(
        _left: ExpressionNode, // TODO: rename
        _right: ExpressionNode,
        compiledConfiguration: CompiledConfiguration,
        comparisonType: ComparisonType,
        domain: DomainPointGenerator? = null
) : Boolean {
    var left = _left.clone()
    var right = _right.clone()
    while (shouldTakeLog(left) && shouldTakeLog(right)) {
        left = getLog(left, compiledConfiguration)
        right = getLog(right, compiledConfiguration)
    }

    val diff = when (comparisonType) {
        ComparisonType.LEFT_MORE, ComparisonType.LEFT_MORE_OR_EQUAL -> difference(left, right, compiledConfiguration)
        else -> difference(right, left, compiledConfiguration)
    }
    val diffMinizer = OptimizerUtils(diff, compiledConfiguration = compiledConfiguration, domain = domain)
    if (diffMinizer.canStart() && diffMinizer.run())
        return false

    val denominator = when (comparisonType) {
        ComparisonType.LEFT_MORE, ComparisonType.LEFT_MORE_OR_EQUAL -> _right
        else -> _left  // TODO: fix bug
    }
    if (alwaysPositive(denominator, compiledConfiguration)) {
        val ratio = when (comparisonType) {
            ComparisonType.LEFT_MORE, ComparisonType.LEFT_MORE_OR_EQUAL -> ratio(left, right, compiledConfiguration)
            else -> ratio(right, left, compiledConfiguration)
        }
        val ratioMinimizer = OptimizerUtils(ratio, compiledConfiguration = compiledConfiguration, domain = domain)
        if (ratioMinimizer.canStart() && ratioMinimizer.run(threshold = 1.0))
            return false
    }
    return true
}