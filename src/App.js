import { Router, Route } from 'react-router-dom';

import history from './history/history'
import * as routes from './constants/routes'

import SignIn from './components/signin'
import AccountSummary from './components/accountSummary'
import AddBeneficiaryDetails from './components/addBeneficiaryDetails'
import ViewBeneficiaryDetails from './components/viewBeneficiaryDetails'
import FundTransfer from './components/fundTransfer'
import TransactionHistory from './components/transactionHistory'

function App() {
  return (
    <Router history={history}>
      <div>
        <Route
          exact
          path={routes.SIGN_IN}
          component={() => <SignIn />}
        />
        <Route
          exact
          path={routes.ACCOUNT_SUMMARY}
          component={() => <AccountSummary />}
        />
        <Route
          exact
          path={routes.ADD_BENEFICIARY_DETAILS}
          component={() => <AddBeneficiaryDetails />}
        />
        <Route
          exact
          path={routes.VIEW_BENEFICIARY_DETAILS}
          component={() => <ViewBeneficiaryDetails />}
        />
        <Route
          exact
          path={routes.FUND_TRANSFER}
          component={() => <FundTransfer />}
        />
        <Route
          exact
          path={routes.TRANSACTION_HISTORY}
          component={() => <TransactionHistory />}
        />
      </div>
    </Router>
  );
}

export default App;
