Feature: SubscriptionBilling

    Scenario: User navigates to SubscriptionBilling
        Given I am a User loading SubscriptionBilling
        When I navigate to the SubscriptionBilling
        Then SubscriptionBilling will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors