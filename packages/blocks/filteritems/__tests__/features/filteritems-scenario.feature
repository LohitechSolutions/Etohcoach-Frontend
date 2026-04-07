Feature: filteritems

    Scenario: User navigates to filteritems
        Given I am a User loading filteritems
        When I navigate to the filteritems
        Then filteritems will load with out errors
        And I can leave the screen with out errors