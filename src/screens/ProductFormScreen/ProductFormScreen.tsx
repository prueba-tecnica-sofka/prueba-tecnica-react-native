import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../../components/common/Button/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage/ErrorMessage';
import { IdInput } from '../../components/common/IdInput/IdInput';
import { Input } from '../../components/common/Input/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { useProductForm } from '../../hooks/useProductForm';
import { formStyles } from './ProductFormScreen.styles';

interface ProductFormScreenProps {
	route?: unknown;
}

export const ProductFormScreen: React.FC<ProductFormScreenProps> = () => {
	const {
		formData,
		errors,
		isLoading,
		isSubmitting,
		isIdChecking,
		mode,
		handleChange,
		handleBlur,
		handleSubmit,
		isFieldDisabled,
	} = useProductForm();

	if (isLoading) {
		return (
			<View style={formStyles.loadingContainer}>
				<LoadingSpinner testID="product-form-loading" />
				<Text style={formStyles.loadingText}>
					{mode === 'edit' ? 'Cargando producto...' : 'Cargando formulario...'}
				</Text>
			</View>
		);
	}

	return (
		<View style={formStyles.container}>
			<View style={formStyles.header}>
				<Text style={formStyles.headerEyebrow}>Gestion de productos</Text>
				<Text style={formStyles.headerTitle}>
					{mode === 'edit' ? 'Editar Producto' : 'Nuevo Producto'}
				</Text>
				<Text style={formStyles.headerSubtitle}>
					{mode === 'edit'
						? 'Actualiza la informacion clave del producto financiero.'
						: 'Completa los datos requeridos para registrar un nuevo producto financiero.'}
				</Text>
			</View>

			<ScrollView
				style={formStyles.scrollView}
				contentContainerStyle={formStyles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={formStyles.form}>
					<View style={formStyles.formSectionHeader}>
						<Text style={formStyles.formTitle}>Datos del producto</Text>
						<Text style={formStyles.formDescription}>
							Verifica cada campo antes de guardar. Las fechas deben cumplir las reglas de validacion del formulario.
						</Text>
					</View>

					<ErrorMessage
						testID="form-error"
						message={errors._form}
						visible={Boolean(errors._form)}
					/>

					<IdInput
						testID="input-id"
						value={formData.id}
						onChangeText={(value) => handleChange('id', value)}
						onBlur={() => void handleBlur('id')}
						error={errors.id}
						isChecking={isIdChecking}
						disabled={isFieldDisabled('id')}
						isEditMode={mode === 'edit'}
						placeholder="Ingresa el identificador"
					/>

					<Input
						testID="input-name"
						label="Nombre"
						value={formData.name}
						onChangeText={(value) => handleChange('name', value)}
						onBlur={() => void handleBlur('name')}
						error={errors.name}
						placeholder="Nombre del producto"
					/>

					<Input
						testID="input-description"
						label="Descripción"
						value={formData.description}
						onChangeText={(value) => handleChange('description', value)}
						onBlur={() => void handleBlur('description')}
						error={errors.description}
						placeholder="Describe el producto"
						multiline
					/>

					<Input
						testID="input-logo"
						label="Logo"
						value={formData.logo}
						onChangeText={(value) => handleChange('logo', value)}
						onBlur={() => void handleBlur('logo')}
						error={errors.logo}
						placeholder="https://..."
						autoCapitalize="none"
					/>

					<Input
						testID="input-date-release"
						label="Fecha de liberación"
						value={formData.date_release}
						onChangeText={(value) => handleChange('date_release', value)}
						onBlur={() => void handleBlur('date_release')}
						error={errors.date_release}
						placeholder="YYYY-MM-DD"
					/>

					<Input
						testID="input-date-revision"
						label="Fecha de revisión"
						value={formData.date_revision}
						onChangeText={(value) => handleChange('date_revision', value)}
						onBlur={() => void handleBlur('date_revision')}
						error={errors.date_revision}
						disabled={Boolean(formData.date_release)}
						placeholder="YYYY-MM-DD"
					/>

					<View style={formStyles.buttonContainer}>
						<Button
							testID="submit-button"
							title={mode === 'edit' ? 'Guardar Cambios' : 'Agregar Producto'}
							onPress={() => void handleSubmit()}
							disabled={isSubmitting || isIdChecking}
							loading={isSubmitting}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default ProductFormScreen;
