<?php

namespace App\Enums;

enum EmailRecipientType: string
{
    case Client = 'client';
    case Dealer = 'dealer';
}
