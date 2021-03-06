four51.app.controller('AwardsCtrl', ['$scope', '$location', '$sce', 'User', 'SpendingAccount', 'Order', 'Address', 'GiftCard', 'ProductDisplayService',
function ($scope, $location, $sce, User, SpendingAccount, Order, Address, GiftCard, ProductDisplayService) {
	$scope.Order = {};
	$scope.Order.LineItems = [];
	$scope.LineItem = {};
	$scope.Order.BudgetAccount = {};
	$scope.Order.ShipAddress = { Country: 'US', IsShipping: true, IsBilling: false };
	
	function setupOrder() {
		$scope.Order.BudgetAccountID = $scope.BudgetAccount.ID;
		$scope.Order.PaymentMethod = 'BudgetAccount';	
	}
	
	function saveOrder() {
		$scope.Order.LineItems.push($scope.LineItem);
		Order.submit($scope.Order,
	        function(data) {
		        $scope.Order = data;
	        },
	        function(ex) {
		        $scope.error = ex.Message;
	        }
        );
	}
	
	$scope.redeemGiftCard = function() {
		$scope.gettingAward = true;
		$scope.error = null;
		GiftCard.redeem(this.giftcard,
			function(card) {
				$scope.giftcard = card;
				SpendingAccount.query(function(data) {
					$scope.BudgetAccount = data[data.length - 1];
					ProductDisplayService.getProductAndVariant($scope.BudgetAccount.AccountType.Name, null, function(data){
						$scope.LineItem.Product = data.product;
						ProductDisplayService.setNewLineItemScope($scope);
						ProductDisplayService.setProductViewScope($scope);
						$scope.LineItem.Quantity = 1;
						$scope.LineItem.LineTotal = 10;
						setupOrder();
						$scope.gettingAward = false;
					});
				});
			},
			function(ex) {
				$scope.error = ex.Message;
				$scope.gettingAward = false;
			}
		);
	}
	
	$scope.$on('event:AddressSaved', function(event, address) {
		$scope.Order.ShipAddressID = address.ID;
		$scope.LineItem.ShipAddressID = address.ID;
		saveOrder();
	});
}]);