package api

import config.CompiledConfiguration
import config.FunctionConfiguration
import expressiontree.ExpressionNode
import expressiontree.ExpressionSubstitution
import expressiontree.SubstitutionPlace
import platformdependent.escapeCharacters


fun expressionSubstitutionFromStrings(
        left: String,
        right: String,
        scope: String = "",
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false,
        functionConfiguration: FunctionConfiguration = FunctionConfiguration(
                scopeFilter = scope.split(";").filter { it.isNotEmpty() }.toSet()
        ),
        compiledConfiguration: CompiledConfiguration = CompiledConfiguration(functionConfiguration = functionConfiguration)
) = ExpressionSubstitution(
        stringToExpression(left, compiledConfiguration = compiledConfiguration),
        stringToExpression(right, compiledConfiguration = compiledConfiguration),
        basedOnTaskContext = basedOnTaskContext,
        matchJumbledAndNested = matchJumbledAndNested
)


fun expressionSubstitutionFromStructureStrings(
        leftStructureString: String,
        rightStructureString: String,
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false
) = ExpressionSubstitution(
        structureStringToExpression(leftStructureString),
        structureStringToExpression(rightStructureString),
        basedOnTaskContext = basedOnTaskContext,
        matchJumbledAndNested = matchJumbledAndNested
)


fun findSubstitutionPlacesInExpression(
        expression: ExpressionNode,
        substitution: ExpressionSubstitution
): MutableList<SubstitutionPlace> {
    if (substitution.leftFunctions.isNotEmpty() && substitution.leftFunctions.intersect(expression.getContainedFunctions())
                    .isEmpty() &&
            substitution.left.getContainedVariables().intersect(expression.getContainedVariables()).isEmpty()
    ) {
        return mutableListOf()
    }
    var expr = expression
    var result = substitution.findAllPossibleSubstitutionPlaces(expression)
    if (result.isEmpty() && substitution.matchJumbledAndNested && expression.containsNestedSameFunctions()){
        expr = expression.cloneWithExpandingNestedSameFunctions()
        result = substitution.findAllPossibleSubstitutionPlaces(expr)
    }
    if (result.isEmpty()){
        expr = expr.cloneAndSimplifyByComputeSimplePlaces()
        result = substitution.findAllPossibleSubstitutionPlaces(expr)
    }
    return result
}


fun applySubstitution(
        expression: ExpressionNode,
        substitution: ExpressionSubstitution,
        substitutionPlaces: List<SubstitutionPlace> //containsPointersOnExpressionPlaces
): ExpressionNode {
    substitution.applySubstitution(substitutionPlaces)
    expression.getTopNode().reduceExtraSigns(setOf("+"), setOf("-"))
    expression.getTopNode().normilizeSubtructions(FunctionConfiguration())
    expression.getTopNode().computeNodeIdsAsNumbersInDirectTraversalAndDistancesToRoot()
    expression.normalizeParentLinks()
    return expression
}





//string API
data class SubstitutionPlaceOfflineData(
        val parentStartPosition: Int,
        val parentEndPosition: Int,
        val startPosition: Int,
        val endPosition: Int
) {
    fun toJSON() = "{" +
            "\"parentStartPosition\":\"$parentStartPosition\"," +
            "\"parentEndPosition\":\"$parentEndPosition\"," +
            "\"startPosition\":\"$startPosition\"," +
            "\"endPosition\":\"$endPosition\"" +
            "}"
}

fun findSubstitutionPlacesCoordinatesInExpressionJSON(
        expression: String,
        substitutionLeft: String,
        substitutionRight: String,
        scope: String = "",
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false,
        functionConfiguration: FunctionConfiguration = FunctionConfiguration(
                scopeFilter = scope.split(";").filter { it.isNotEmpty() }.toSet()
        ),
        compiledConfiguration: CompiledConfiguration = CompiledConfiguration(functionConfiguration = functionConfiguration)
): String {
    val substitutionPlaces = findSubstitutionPlacesInExpression(
            stringToExpression(expression, compiledConfiguration = compiledConfiguration),
            expressionSubstitutionFromStrings(
                    substitutionLeft, substitutionRight,
                    basedOnTaskContext = basedOnTaskContext, compiledConfiguration = compiledConfiguration, matchJumbledAndNested = matchJumbledAndNested
            )
    )

    val data = substitutionPlaces.map {
        SubstitutionPlaceOfflineData(
                it.nodeParent.startPosition, it.nodeParent.endPosition,
                it.nodeParent.children[it.nodeChildIndex].startPosition,
                it.nodeParent.children[it.nodeChildIndex].endPosition
        )
    }.joinToString(separator = ",") { it.toJSON() }

    return "{\"substitutionPlaces\":[$data]}"
}

fun findStructureStringsSubstitutionPlacesCoordinatesInExpressionJSON(
        expression: String,
        substitutionLeftStructureString: String,
        substitutionRightStructureString: String,
        scope: String = "",
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false,
        functionConfiguration: FunctionConfiguration = FunctionConfiguration(
                scopeFilter = scope.split(";").filter { it.isNotEmpty() }.toSet()
        ),
        compiledConfiguration: CompiledConfiguration = CompiledConfiguration(functionConfiguration = functionConfiguration)
): String {
    val substitutionPlaces = findSubstitutionPlacesInExpression(
            stringToExpression(expression, compiledConfiguration = compiledConfiguration),
            expressionSubstitutionFromStructureStrings(
                    substitutionLeftStructureString, substitutionRightStructureString,
                    basedOnTaskContext = basedOnTaskContext, matchJumbledAndNested = matchJumbledAndNested
            )
    )

    val data = substitutionPlaces.map {
        SubstitutionPlaceOfflineData(
                it.nodeParent.startPosition, it.nodeParent.endPosition,
                it.nodeParent.children[it.nodeChildIndex].startPosition,
                it.nodeParent.children[it.nodeChildIndex].endPosition
        )
    }.joinToString(separator = ",") { it.toJSON() }

    return "{\"substitutionPlaces\":[$data]}"
}

fun applyExpressionBySubstitutionPlaceCoordinates(
        expression: String,
        substitutionLeft: String,
        substitutionRight: String,
        parentStartPosition: Int,
        parentEndPosition: Int,
        startPosition: Int,
        endPosition: Int,
        scope: String = "",
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false,
        characterEscapingDepth: Int = 1,
        functionConfiguration: FunctionConfiguration = FunctionConfiguration(
                scopeFilter = scope.split(";").filter { it.isNotEmpty() }.toSet()
        ),
        compiledConfiguration: CompiledConfiguration = CompiledConfiguration(functionConfiguration = functionConfiguration)
): String {
    val actualExpression = stringToExpression(expression, compiledConfiguration = compiledConfiguration)
    val actualSubstitution = expressionSubstitutionFromStrings(
            substitutionLeft, substitutionRight,
            basedOnTaskContext = basedOnTaskContext, compiledConfiguration = compiledConfiguration, matchJumbledAndNested = matchJumbledAndNested
    )
    val substitutionPlaces = findSubstitutionPlacesInExpression(
            actualExpression,
            actualSubstitution
    )

    val actualPlace = substitutionPlaces.filter {
        it.nodeParent.startPosition == parentStartPosition &&
                it.nodeParent.endPosition == parentEndPosition &&
                it.nodeParent.children[it.nodeChildIndex].startPosition == startPosition &&
                it.nodeParent.children[it.nodeChildIndex].endPosition == endPosition
    }

    val result = if (actualPlace.isNotEmpty()) {
        applySubstitution(actualExpression, actualSubstitution, actualPlace)
    } else {
        actualExpression
    }

    return escapeCharacters(expressionToString(result), characterEscapingDepth)
}

fun applyExpressionByStructureStringsSubstitutionPlaceCoordinates(
        expression: String,
        substitutionLeftStructureString: String,
        substitutionRightStructureString: String,
        parentStartPosition: Int,
        parentEndPosition: Int,
        startPosition: Int,
        endPosition: Int,
        scope: String = "",
        basedOnTaskContext: Boolean = false,
        matchJumbledAndNested: Boolean = false,
        characterEscapingDepth: Int = 1,
        functionConfiguration: FunctionConfiguration = FunctionConfiguration(
                scopeFilter = scope.split(";").filter { it.isNotEmpty() }.toSet()
        ),
        compiledConfiguration: CompiledConfiguration = CompiledConfiguration(functionConfiguration = functionConfiguration)
): String {
    val actualExpression = stringToExpression(expression, compiledConfiguration = compiledConfiguration)
    val actualSubstitution = expressionSubstitutionFromStructureStrings(
            substitutionLeftStructureString, substitutionRightStructureString,
            basedOnTaskContext = basedOnTaskContext,
            matchJumbledAndNested = matchJumbledAndNested
    )
    val substitutionPlaces = findSubstitutionPlacesInExpression(
            actualExpression,
            actualSubstitution
    )

    val actualPlace = substitutionPlaces.filter {
        it.nodeParent.startPosition == parentStartPosition &&
                it.nodeParent.endPosition == parentEndPosition &&
                it.nodeParent.children[it.nodeChildIndex].startPosition == startPosition &&
                it.nodeParent.children[it.nodeChildIndex].endPosition == endPosition
    }

    val result = if (actualPlace.isNotEmpty()) {
        applySubstitution(actualExpression, actualSubstitution, actualPlace)
    } else {
        actualExpression
    }

    return escapeCharacters(expressionToString(result), characterEscapingDepth)
}
