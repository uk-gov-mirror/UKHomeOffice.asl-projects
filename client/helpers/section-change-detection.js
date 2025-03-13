import { hasDatabaseChange } from './field-change-detection';

/**
 * Determines if any fields in a given section have changed by comparing their current and initial values.
 *
 * @param {Array} fields - The list of field names to check for changes.
 * @param {Object} currentValues - The current values of the fields, typically from user input or state.
 * @param {Object} initialValues - The initial values of the fields, typically from the database or original state.
 * @param {Object} latestSubmittedValues - The most recent submitted version values.
 * @param {Object} firstSubmittedValues - The first submitted version values.
 * @param {Object} grantedValues - The current granted license values.
 * @param {boolean} isGranted - Indicates if the license is granted.
 * @returns {boolean} - Returns `true` if at least one field has changed, otherwise `false`.
 */
export function hasSectionChanged(
    fields,
    currentValues,
    initialValues,
    latestSubmittedValues,
    firstSubmittedValues,
    grantedValues,
    isGranted
) {
    const sectionHasChanges = fields.some(field =>
        hasDatabaseChange(
            field,
            initialValues[field],
            currentValues[field],
            latestSubmittedValues[field],
            firstSubmittedValues[field],
            grantedValues[field],
            isGranted,
            currentValues,
            () => false
        )
    );

    return sectionHasChanges;
}