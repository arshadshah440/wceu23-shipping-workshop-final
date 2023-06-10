/**
 * External dependencies
 */
import { useEffect, useState, useCallback } from '@wordpress/element';
import { SelectControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import { options } from './options';

export const Block = ( { checkoutExtensionData, extensions } ) => {
	/**
	 * setExtensionData will update the wc/store/checkout data store with the values supplied. It can be used to pass
	 * data from the client to the server when submitting the checkout form.
	 */
	const { setExtensionData } = checkoutExtensionData;
	/**
	 * Debounce the setExtensionData function to avoid multiple calls to the API when rapidly changing options.
	 */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetExtensionData = useCallback(
		debounce( ( namespace, key, value ) => {
			setExtensionData( namespace, key, value );
		}, 1000 ),
		[ setExtensionData ]
	);

	const validationErrorId = 'shipping-workshop-other-value';

	const { setValidationErrors, clearValidationError } = useDispatch(
		'wc/store/validation'
	);

	const validationError = useSelect( ( select ) => {
		const store = select( 'wc/store/validation' );
		/**
		 * 📝 Write some code to get the validation error from the `wc/store/validation` data store.
		 * Using the `getValidationError` selector on the `store` object, get the validation error.
		 *
		 * The `validationErrorId` variable can be used to get the validation error. Documentation on the validation
		 * data store can be found here:
		 * https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/data-store/validation.md
		 */
		return store.getValidationError( validationErrorId );

		/**
		 * 💰 Extra credit: In the `useEffect` that handles the "other" textarea, only call `clearValidationError` if the
		 * validation error is in the data store already.
		 */
	} );
	const [
		selectedAlternateShippingInstruction,
		setSelectedAlternateShippingInstruction,
	] = useState( 'try-again' );
	const [ otherShippingValue, setOtherShippingValue ] = useState( '' );

	/* Handle changing the select's value */
	useEffect( () => {
		/**
		 * 📝 Using `setExtensionData`, write some code in this useEffect that will run when the `selectedAlternateShippingInstruction` value changes.
		 *
		 * The API of this function is: setExtensionData( namespace, key, value )
		 *
		 * This code should use `setExtensionData` to update the `alternateShippingInstruction` key in the `shipping-workshop`
		 * namespace of the checkout data store.
		 */
		setExtensionData(
			'shipping-workshop',
			'alternateShippingInstruction',
			selectedAlternateShippingInstruction
		);
	}, [ setExtensionData, selectedAlternateShippingInstruction ] );

	/**
	 * 💰 Extra credit: Use a `useState` to track whether the user has interacted with the "other" textbox. If they have,
	 * then the validation error should not be hidden when the user changes the select's value. If it is "pristine" then
	 * we should keep the error hidden.
	 */

	/* Handle changing the "other" value */
	useEffect( () => {
		/**
		 * 📝 Write some code in this useEffect that will run when the `otherShippingValue` value changes.
		 * This code should use `setExtensionData` to update the `otherShippingValue` key in the `shipping-workshop`
		 * namespace of the checkout data store.
		 */
		setExtensionData(
			'shipping-workshop',
			'otherShippingValue',
			otherShippingValue
		);
		/**
		 * 💰 Extra credit: Ensure the `setExtensionData` function is not called multiple times. We can use the
		 * `debouncedSetExtensionData` function for this. The API is the same.
		 */

		/**
		 * 📝Write some code that will use `setValidationErrors` to add an entry to the validation data store if
		 * `otherShippingValue` is empty.
		 *
		 * The API of this function is: `setValidationErrors( errors )`.
		 *
		 * `errors` is an object with the following shape:
		 * {
		 *     [ validationErrorId ]: {
		 *  		message: string,
		 *	    	hidden: boolean,
		 *     }
		 * }
		 *
		 * For now, the error should remain hidden until the user has interacted with the field.
		 *
		 * 💡Don't forget to update the dependencies of the `useEffect` when you reference new functions/variables!
		 *
		 * ☝️If the `selectedAlternateShippingInstruction` is not `other` let's skip adding the validation error.
		 */
		if (
			selectedAlternateShippingInstruction !== 'other' ||
			otherShippingValue !== ''
		) {
			if ( validationError ) {
				clearValidationError( validationErrorId );
			}
			return;
		}
		setValidationErrors( {
			[ validationErrorId ]: {
				message: __( 'Please add some text', 'shipping-workshop' ),
				hidden: true,
			},
		} );

		/**
		 * 📝Update the above code so that it will use `clearValidationError` to remove the validation error from the
		 * data store if `selectedAlternateShippingInstruction` is not `other`, or if the `otherShippingValue` is not empty.
		 *
		 * The API of `clearValidationError` is: `clearValidationError( validationErrorId )`
		 *
		 * 💡Don't forget to update the dependencies of the `useEffect` when you reference new functions/variables!
		 */
	}, [
		clearValidationError,
		selectedAlternateShippingInstruction,
		setValidationErrors,
		validationErrorId,
		otherShippingValue,
		debouncedSetExtensionData,
		validationError,
	] );

	return (
		<div className="wp-block-shipping-workshop-not-at-home">
			{ /**
			 * 📝 Go to options.js and add some new options to display in the SelectControl below.
			 */ }
			<SelectControl
				label={ __(
					'If I am not at home please…',
					'shipping-workshop'
				) }
				value={ selectedAlternateShippingInstruction }
				options={ options }
				onChange={ setSelectedAlternateShippingInstruction }
			/>

			{ selectedAlternateShippingInstruction === 'other' && (
				<>
					<TextareaControl
						className={
							'shipping-workshop-other-textarea' +
							( validationError?.hidden === false
								? ' has-error'
								: '' )
						}
						onChange={ ( e ) => {
							setOtherShippingValue( e );
							setHasInteracted( true );
						} }
						onBlur={ () => setHasInteracted( true ) }
						value={ otherShippingValue }
						required={ true }
						placeholder={ __(
							'Enter shipping instructions',
							'shipping-workshop'
						) }
					/>
					{ /**
					 * 📝 Write some code in this block that will render a validation error if the validation error
					 * we're using in the wc/store/validation data store is not hidden. It's fine to just use a div,
					 * and display the `message` property of the validation error.
					 */ }

					{ validationError?.hidden ? null : (
						<div className="wc-block-components-validation-error">
							{ validationError?.message }
						</div>
					) }
				</>
			) }
		</div>
	);
};
