/**
 * Token type
 */
export interface Token {
  card: Card;
  applicationId: string;
  token: string;
  customerUserId: number;
}

interface Card {
  type: string;
  status: string;
  expirationMonth: number;
  expirationYear: number;
  id: number;
  numberFirst6: string;
  numberLast4: string;
  numberMasked: string;
  cardId: string;
  cardHolderFirstName: string;
  cardHolderFullName: string;
  cardHolderLastName: string;
}
