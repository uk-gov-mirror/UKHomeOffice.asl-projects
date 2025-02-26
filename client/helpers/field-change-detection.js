import isEqual from 'lodash/isEqual';
import { normaliseValue } from './normalisation';
import { normaliseDuration } from './normalise-duration';
/**
 * Checks whether the stored database value has changed compared to the current value.
 *
 * @param {string} fieldName - The name of the field being checked.
 * @param {any} storedValue - The original stored value from the database.
 * @param {any} currentValue - The current user-modified value.
 * @param {Object} values - All values from the form.
 * @param {Function} hasSpeciesFieldChanges - Function to check species-specific changes.
 * @returns {boolean} - `true` if a change is detected, otherwise `false`.
 */
export function hasDatabaseChange(fieldName, storedValue, currentValue, values, hasSpeciesFieldChanges) {
  // Prevents crashes if fieldName is undefined or invalid
  if (fieldName == null) {
    throw new Error('fieldName must be provided.');
  }

  console.log(`Field name: ${fieldName}`);
  console.log(`Stored field value: normaliseValue(${storedValue})`);
  console.log(`Current field value:`, JSON.stringify(normaliseValue(currentValue), null, 2));
  console.log(`Full object:`, values);  // No need for template literals for objects

  const actualCurrentValue = currentValue ?? values?.[fieldName] ?? '';
  const adjustedStoredValue = fieldName === 'duration' ? normaliseDuration(storedValue) : storedValue;

  const normalisedStoredValue = fieldName === 'duration'
    ? normaliseDuration(adjustedStoredValue)
    : normaliseValue(adjustedStoredValue);

  const normalisedCurrentValue = fieldName === 'duration'
    ? normaliseDuration(actualCurrentValue)
    : normaliseValue(actualCurrentValue);

  let hasChange = !isEqual(normalisedStoredValue, normalisedCurrentValue);

  if (values?.species?.length) {
    hasChange = hasSpeciesFieldChanges(values) || hasChange;
  }

  return hasChange;
}
