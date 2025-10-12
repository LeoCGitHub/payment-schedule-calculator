import { FormSelectOption } from '@/components/Form/FormSelect/FormSelect';

export const PERIODICITY_OPTIONS: FormSelectOption[] = [
  { value: 'Mensuel', label: 'Mensuel' },
  { value: 'Trimestriel', label: 'Trimestriel' },
  { value: 'Semestriel', label: 'Semestriel' },
  { value: 'Annuel', label: 'Annuel' },
];

export const FORM_LABELS = {
  firstPaymentDate: 'Date de la première échéance',
  periodicity: 'Périodicité',
  contractDuration: 'Durée contractuelle (en mois)',
  assetValue: "Valeur de l'actif",
  rentAmount: 'Montant du loyer (fixe et payé à terme échu)',
  purchaseOptionValue: "Valeur de l'option d'achat",
} as const;

export const SUBMIT_BUTTON_LABELS = {
  default: "Calculer l'échéancier",
  loading: 'Calcul en cours...',
} as const;
