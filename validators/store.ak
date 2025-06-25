use cardano/transaction.{OutputReference, Transaction}

validator store {
  spend(
    _datum: Option<Void>,
    _redeemer: Void,
    _output_reference: OutputReference,
    _transaction: Transaction,
  ) {
    True
  }

  else(_) {
    fail
  }
}
