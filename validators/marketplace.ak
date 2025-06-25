use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}

validator marketplace {
  mint(_redeemer: Data, _policy_id: PolicyId, _transaction: Transaction) {
    True
  }

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
