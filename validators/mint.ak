use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}

validator mint {
  mint(_redeemer: Data, _policy_id: PolicyId, _self: Transaction) {
    True
  }

  else(_) {
    fail
  }
}
