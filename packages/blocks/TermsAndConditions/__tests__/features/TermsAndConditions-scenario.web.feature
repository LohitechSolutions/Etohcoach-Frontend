Feature: TermsAndConditions

    Scenario: User navigates to TermsAndConditions
        Given I am a User loading TermsAndConditions
        When I navigate to the TermsAndConditions
        Then TermsAndConditions will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors